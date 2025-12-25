import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import * as roomService from "@/services/roomService";
import * as messageService from "@/services/messageService";
import toast from "react-hot-toast";

import ChatSidebar from "@/components/organisms/ChatSidebar/ChatSidebar";
import ChatHeader from "@/components/organisms/ChatHeader/ChatHeader";
import MessageList from "@/components/organisms/MessageList/MessageList";
import MessageInput from "@/components/organisms/MessageInput/MessageInput";
import RoomInfo from "@/components/organisms/RoomInfo/RoomInfo";
import EmptyChatState from "@/components/organisms/EmptyChatState/EmptyChatState";
import SummaryModal from "@/components/molecules/SummaryModal/SummaryModal";
import ImageGridViewer from "@/components/molecules/ImageGridViewer/ImageGridViewer";

const ChatPage = () => {
  /* ================= AUTH & SOCKET ================= */
  const { user, logout, loading: authLoading } = useAuth();
  const { socket, connected, sendMessage, joinRoom, recallMessage } = useSocket();

  /* ================= STATES ================= */
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults] = useState([]);

  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary] = useState("");
  const [summarizing] = useState(false);

  const [showImageGallery, setShowImageGallery] = useState(false);

  // Reply state
  const [replyingTo, setReplyingTo] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /* ================= REFS ================= */
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const selectedRoomRef = useRef(null);
  const shouldAutoScrollRef = useRef(true); // Track if we should auto-scroll
  const previousScrollHeightRef = useRef(0); // Track scroll height for pagination

  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  /* ================= SCROLL HELPERS ================= */
  /**
   * Check if user is near the bottom of the chat
   * @param {number} threshold - Distance from bottom in pixels (default: 150)
   * @returns {boolean} - True if user is near bottom
   */
  const isNearBottom = useCallback((threshold = 150) => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom <= threshold;
  }, []);

  /**
   * Scroll to bottom of chat smoothly
   */
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  /**
   * Handle scroll event - update auto-scroll flag
   */
  const handleScroll = useCallback(() => {
    shouldAutoScrollRef.current = isNearBottom(150);
  }, [isNearBottom]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await roomService.getRooms();
        setRooms(res.data || res.rooms || []);
      } catch {
        toast.error("Không thể tải danh sách phòng");
      }
    };

    if (user?.id) {
      loadRooms();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!socket || !connected) return;

    const handleReceiveMessage = (message) => {
      if (selectedRoomRef.current?.id !== message.room_id) return;

      setMessages((prev) => {
        // Remove temp message if exists (to avoid duplicate)
        const filteredPrev = prev.filter(
          (m) => !String(m.id).startsWith("temp-")
        );

        // Check if message already exists
        if (filteredPrev.some((m) => m.id === message.id)) return prev;

        return [...filteredPrev, message];
      });
    };

    const handleRoomUpdated = (data) => {
      if (data.action === "members_added" && data.room) {
        // Update room in rooms list with participant_count
        setRooms((prev) =>
          prev.map((r) => {
            if (r.id === data.room.id) {
              return {
                ...r,
                ...data.room,
                participant_count:
                  data.room.participants?.length || r.participant_count,
              };
            }
            return r;
          })
        );

        // Update selected room if it's the same room
        if (selectedRoomRef.current?.id === data.room.id) {
          setSelectedRoom({
            ...selectedRoomRef.current,
            ...data.room,
            participant_count:
              data.room.participants?.length ||
              selectedRoomRef.current.participant_count,
          });
        }
      }
    };

    // Handle message recalled event
    const handleMessageRecalled = (data) => {
      console.log('🔴 [ChatPage] ============ MESSAGE RECALLED EVENT ============');
      console.log('🔴 [ChatPage] Received data:', JSON.stringify(data, null, 2));
      console.log('🔴 [ChatPage] Message ID:', data.messageId);
      console.log('🔴 [ChatPage] Room ID:', data.room_id);
      console.log('🔴 [ChatPage] Current room ID:', selectedRoomRef.current?.id);
      console.log('🔴 [ChatPage] Is recalled:', data.is_recalled);
      console.log('🔴 [ChatPage] Recalled at:', data.recalled_at);

      setMessages((prev) => {
        console.log('🔴 [ChatPage] Current messages count:', prev.length);
        const messageToUpdate = prev.find((m) => m.id === data.messageId);
        console.log('🔴 [ChatPage] Found message to update:', messageToUpdate ? 'YES' : 'NO');

        if (messageToUpdate) {
          console.log('🔴 [ChatPage] Message before update:', {
            id: messageToUpdate.id,
            content: messageToUpdate.content?.substring(0, 50),
            is_recalled: messageToUpdate.is_recalled
          });
        }

        const updated = prev.map((msg) =>
          msg.id === data.messageId
            ? {
                ...msg,
                is_recalled: true,
                recalled_at: data.recalled_at,
                content: msg.content // Keep original content in memory
              }
            : msg
        );

        const updatedMessage = updated.find((m) => m.id === data.messageId);
        if (updatedMessage) {
          console.log('🔴 [ChatPage] Message after update:', {
            id: updatedMessage.id,
            is_recalled: updatedMessage.is_recalled,
            recalled_at: updatedMessage.recalled_at
          });
        }

        console.log('🔴 [ChatPage] ================================================');
        return updated;
      });

      // If replying to the recalled message, clear the reply
      if (replyingTo?.id === data.messageId) {
        console.log('🔴 [ChatPage] Clearing reply state (was replying to recalled message)');
        setReplyingTo(null);
      }

      toast.success('Tin nhắn đã được thu hồi');
    };

    // Handle socket error
    const handleSocketError = (error) => {
      console.error('🔴 [ChatPage] Socket error:', error);
      toast.error(error.message || 'Đã xảy ra lỗi');
    };

    console.log('🟢 [ChatPage] Registering socket event listeners');
    console.log('🟢 [ChatPage] Socket ID:', socket.id);
    console.log('🟢 [ChatPage] Connected:', connected);

    socket.on("receive_message", handleReceiveMessage);
    socket.on("room_updated", handleRoomUpdated);
    socket.on("message_recalled", handleMessageRecalled);
    socket.on("error", handleSocketError);

    return () => {
      console.log('🟡 [ChatPage] Unregistering socket event listeners');
      socket.off("receive_message", handleReceiveMessage);
      socket.off("room_updated", handleRoomUpdated);
      socket.off("message_recalled", handleMessageRecalled);
      socket.off("error", handleSocketError);
    };
  }, [socket, connected, replyingTo]);

  useEffect(() => {
    if (!selectedRoom) return;

    const loadMessages = async () => {
      try {
        setLoading(true);

        const res = await messageService.getMessages(selectedRoom.id);
        const messagesData = res.data || res.messages || [];

        // Sort messages chronologically (old → new) based on created_at
        const sortedMessages = messagesData.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateA - dateB; // Ascending order: oldest first
        });

        setMessages(sortedMessages);

        // Load full room details to get participants
        if (
          selectedRoom.type === "GROUP" ||
          selectedRoom.type === "AI_PRIVATE"
        ) {
          const roomDetail = await roomService.getRoomDetail(selectedRoom.id);
          if (roomDetail?.data) {
            const updatedRoom = {
              ...roomDetail.data,
              participant_count: roomDetail.data.participants?.length || 0,
            };
            setSelectedRoom(updatedRoom);

            // Update room in list
            setRooms((prev) =>
              prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
            );
          }
        }

        joinRoom?.(selectedRoom.id);

        // Force scroll to bottom on initial load
        shouldAutoScrollRef.current = true;
        setTimeout(() => {
          scrollToBottom('auto');
        }, 100);
      } catch {
        toast.error("Không thể tải tin nhắn");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Clear reply state when switching rooms
    setReplyingTo(null);
  }, [selectedRoom?.id, connected, joinRoom, scrollToBottom]);

  // Auto-scroll effect - only when user is near bottom
  useEffect(() => {
    if (messages.length > 0 && shouldAutoScrollRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 50);
    }
  }, [messages, scrollToBottom]);

  // Attach scroll listener to container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ================= HANDLERS ================= */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRoom) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageInput,
      user: user,
      user_id: user.id,
      room_id: selectedRoom.id,
      type: "TEXT",
      created_at: new Date().toISOString(),
      reply_to_message_id: replyingTo?.id || null,
      replyToMessage: replyingTo || null,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");

    // Ensure we scroll when sending a message
    shouldAutoScrollRef.current = true;

    // Clear reply state after sending
    const replyToMessageId = replyingTo?.id || null;
    setReplyingTo(null);

    if (socket?.connected) {
      sendMessage({
        roomId: selectedRoom.id,
        content: tempMessage.content,
        reply_to_message_id: replyToMessageId,
      });
    } else {
      toast.error("Socket chưa kết nối");
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleRecall = async (messageId) => {
    try {
      if (socket?.connected) {
        recallMessage(messageId);
      } else {
        // Fallback to REST API if socket not connected
        await messageService.recallMessage(messageId);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, is_recalled: true, recalled_at: new Date().toISOString() }
              : msg
          )
        );
        toast.success('Đã thu hồi tin nhắn');
      }
    } catch (error) {
      console.error('Error recalling message:', error);
      toast.error(error.response?.data?.message || 'Không thể thu hồi tin nhắn');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  /* ================= PAGINATION ================= */
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore || !selectedRoom) return;

    setLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const res = await messageService.getMessages(selectedRoom.id, nextPage, 5);
      const messagesData = res.data || res.messages || [];

      if (messagesData.length === 0) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      // Sort messages chronologically (old → new) based on created_at
      const sortedMessages = messagesData.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB; // Ascending order: oldest first
      });

      // Prepend older messages to the beginning (maintain chronological order)
      setMessages((prev) => [...sortedMessages, ...prev]);

      // Check if there are more messages
      // Try to get hasMore from response, fallback to calculation
      const hasMoreMessages = res.hasMore !== undefined
        ? res.hasMore
        : res.currentPage < res.totalPages;

      setHasMore(hasMoreMessages);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error("Không thể tải thêm tin nhắn");
    } finally {
      setLoadingMore(false);
    }
  };

  /* ================= GUARDS ================= */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ================= RENDER ================= */
  return (
    <div className="h-screen flex overflow-hidden">
      <ChatSidebar
        user={user}
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <ChatHeader
              room={selectedRoom}
              currentUserId={user.id}
              onToggleInfo={() => setShowRoomInfo((p) => !p)}
            />

            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
              <MessageList
                messages={messages}
                currentUserId={user.id}
                loading={loading}
                messagesEndRef={messagesEndRef}
                onReply={handleReply}
                onRecall={handleRecall}
              />
            </div>

            <MessageInput
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onSubmit={handleSendMessage}
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
            />
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>

      {showRoomInfo && selectedRoom && (
        <RoomInfo room={selectedRoom} currentUserId={user.id} />
      )}

      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        summary={summary}
        loading={summarizing}
      />

      <ImageGridViewer
        messages={messages}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
      />
    </div>
  );
};

export default ChatPage;
