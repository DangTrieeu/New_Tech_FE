import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import * as roomService from "@/services/roomService";
import * as messageService from "@/services/messageService";
import * as userService from "@/services/userService";
import { uploadFile } from "@/services/uploadService";
import { validateFile } from "@/utils/fileValidation";
import { chatWithAI, summarizeConversation } from "@/services/aiService";
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
  const { socket, connected, sendMessage, joinRoom } = useSocket();

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

  /* ================= STATES ================= */
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [aiProcessing, setAiProcessing] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const [showImageGallery, setShowImageGallery] = useState(false);

  /* ================= REFS ================= */
  const messagesEndRef = useRef(null);
  const selectedRoomRef = useRef(null);

  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

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

    loadRooms();
  }, [user.id]);

  useEffect(() => {
    if (!socket || !connected) return;

    const handleReceiveMessage = (message) => {
      if (selectedRoomRef.current?.id !== message.room_id) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleRoomUpdated = (data) => {
      if (data.action === "members_added" && data.room) {
        // Update room in rooms list
        setRooms((prev) =>
          prev.map((r) => (r.id === data.room.id ? data.room : r))
        );

        // Update selected room if it's the same room
        if (selectedRoomRef.current?.id === data.room.id) {
          setSelectedRoom(data.room);
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("room_updated", handleRoomUpdated);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("room_updated", handleRoomUpdated);
    };
  }, [socket, connected]);

  useEffect(() => {
    if (!selectedRoom) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await messageService.getMessages(selectedRoom.id);
        setMessages(res.data || res.messages || []);

        // Load full room details to get participants
        if (selectedRoom.type === "GROUP") {
          const roomDetail = await roomService.getRoomDetail(selectedRoom.id);
          if (roomDetail?.data) {
            setSelectedRoom(roomDetail.data);
          }
        }

        joinRoom?.(selectedRoom.id);
      } catch {
        toast.error("Không thể tải tin nhắn");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedRoom?.id, connected, joinRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");

    if (socket?.connected) {
      sendMessage({ roomId: selectedRoom.id, content: tempMessage.content });
    } else {
      toast.error("Socket chưa kết nối");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

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

            <MessageList
              messages={messages}
              currentUserId={user.id}
              loading={loading}
              messagesEndRef={messagesEndRef}
            />

            <MessageInput
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onSubmit={handleSendMessage}
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
