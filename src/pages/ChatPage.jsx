import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import * as roomService from '@/services/roomService';
import * as messageService from '@/services/messageService';
import * as userService from '@/services/userService';
import toast from 'react-hot-toast';

import ChatSidebar from '@/components/organisms/ChatSidebar/ChatSidebar';
import ChatHeader from '@/components/organisms/ChatHeader/ChatHeader';
import MessageList from '@/components/organisms/MessageList/MessageList';
import MessageInput from '@/components/organisms/MessageInput/MessageInput';
import RoomInfo from '@/components/organisms/RoomInfo/RoomInfo';
import EmptyChatState from '@/components/organisms/EmptyChatState/EmptyChatState';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const { socket, connected, sendMessage } = useSocket();

  // States
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const selectedRoomRef = useRef(null);

  // Update ref when selectedRoom changes
  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  // Functions
  const loadRooms = async () => {
    try {
      const response = await roomService.getRooms();
      const roomsData = response.data || response.rooms || [];
      setRooms(roomsData);
    } catch (error) {
      console.error('Load rooms failed:', error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      setLoading(true);
      const response = await messageService.getMessages(roomId);
      const messagesData = response.data || response.messages || [];

      const normalizedMessages = messagesData.map(msg => ({
        ...msg,
        sender_id: msg.user_id || msg.sender_id,
        sender: msg.user || msg.sender,
      }));

      const sortedMessages = normalizedMessages.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
      });

      setMessages(sortedMessages);
    } catch (error) {
      console.error('[ChatPage] Load messages failed:', error);
      toast.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !connected) return;

    const handleReceiveMessage = (message) => {
      const normalizedMessage = {
        ...message,
        sender_id: message.user_id || message.sender_id || message.senderId || message.userId || message.sender?.id || message.user?.id,
        sender: message.user || message.sender,
      };

      if (selectedRoomRef.current && message.room_id === selectedRoomRef.current.id) {
        setMessages((prev) => {
          const withoutTemp = prev.filter(msg => !msg.id.toString().startsWith('temp-'));
          const exists = withoutTemp.some(msg => msg.id === normalizedMessage.id);
          if (exists) return prev;
          return [...withoutTemp, normalizedMessage];
        });
      }

      loadRooms();
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [connected, socket, user]);

  // Load messages when room selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      if (socket) {
        socket.emit('join_room', { roomId: selectedRoom.id });
      } else {
        console.error('[ChatPage] Cannot join room - socket not available');
      }
      setShowRoomInfo(false);
    }
  }, [selectedRoom, socket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRoom) return;

    const messageData = {
      roomId: selectedRoom.id,
      content: messageInput.trim(),
      type: 'TEXT',
    };

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageData.content,
      sender_id: user?.id,
      sender: user,
      room_id: selectedRoom.id,
      type: 'TEXT',
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput('');

    if (socket && socket.connected) {
      sendMessage(messageData);
    } else {
      toast.error('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.');
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await userService.searchUsers(query);
      setSearchResults(response.data || response.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCreatePrivateChat = async (partnerId) => {
    try {
      const response = await roomService.createPrivateRoom(partnerId);
      const room = response.data || response.room;
      setSelectedRoom(room);
      await loadRooms();
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Create room failed:', error);
      toast.error('Không thể tạo cuộc trò chuyện');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Left Sidebar */}
      <ChatSidebar
        user={user}
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchResults={searchResults}
        onCreatePrivateChat={handleCreatePrivateChat}
        onLogout={handleLogout}
      />

      {/* Middle - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <ChatHeader
              room={selectedRoom}
              currentUserId={user?.id}
              onToggleInfo={() => setShowRoomInfo(!showRoomInfo)}
            />

            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--background-color)' }}>
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                loading={loading}
                messagesEndRef={messagesEndRef}
              />
            </div>

            <MessageInput
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onSubmit={handleSendMessage}
              disabled={!messageInput.trim()}
            />
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>

      {/* Right Sidebar - Room Info */}
      {showRoomInfo && selectedRoom && (
        <RoomInfo room={selectedRoom} currentUserId={user?.id} />
      )}
    </div>
  );
};

export default ChatPage;

