import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import * as roomService from '@/services/roomService';
import * as messageService from '@/services/messageService';
import * as userService from '@/services/userService';
import { uploadFile } from '@/services/uploadService';
import { validateFile } from '@/utils/fileValidation';
import { chatWithAI, summarizeConversation } from '@/services/aiService';
import toast from 'react-hot-toast';

import ChatSidebar from '@/components/organisms/ChatSidebar/ChatSidebar';
import ChatHeader from '@/components/organisms/ChatHeader/ChatHeader';
import MessageList from '@/components/organisms/MessageList/MessageList';
import MessageInput from '@/components/organisms/MessageInput/MessageInput';
import RoomInfo from '@/components/organisms/RoomInfo/RoomInfo';
import EmptyChatState from '@/components/organisms/EmptyChatState/EmptyChatState';
import SummaryModal from '@/components/molecules/SummaryModal/SummaryModal';
import ImageGridViewer from '@/components/molecules/ImageGridViewer/ImageGridViewer';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const { socket, connected, sendMessage, joinRoom } = useSocket();

  // Debug socket state on mount and when it changes
  useEffect(() => {
    console.log('[ChatPage] Component mounted/updated - Socket state:', {
      socketExists: !!socket,
      connected,
      userExists: !!user,
      userId: user?.id,
      userName: user?.name
    });
  }, [socket, connected, user]);

  // States
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  // File upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  // AI feature states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Image gallery state
  const [showImageGallery, setShowImageGallery] = useState(false);

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
      // Use joinRoom function from SocketContext instead of direct socket.emit
      if (connected && joinRoom) {
        joinRoom(selectedRoom.id);
      }
      setShowRoomInfo(false);
    }
  }, [selectedRoom, connected, joinRoom]);

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

    const trimmedMessage = messageInput.trim();

    // Check if it's an AI command
    if (trimmedMessage.startsWith('@AI ')) {
      const aiQuery = trimmedMessage.substring(4).trim();

      if (aiQuery.toLowerCase() === 'summarize') {
        // Handle summarize command
        handleSummarize();
        setMessageInput('');
        return;
      }

      // Handle AI chat
      await handleAIChat(aiQuery);
      setMessageInput('');
      return;
    }

    const messageData = {
      roomId: selectedRoom.id,
      content: trimmedMessage,
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

    console.log('[ChatPage] Attempting to send message:', {
      messageData,
      socketExists: !!socket,
      socketConnected: socket?.connected,
      connected,
      roomId: selectedRoom.id,
      userId: user?.id
    });

    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput('');

    if (socket && socket.connected) {
      console.log('[ChatPage] Socket is connected, sending message...');
      sendMessage(messageData);
    } else {
      console.error('[ChatPage] Cannot send message - Socket state:', {
        socketExists: !!socket,
        socketConnected: socket?.connected,
        connectedState: connected
      });
      toast.error('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.');
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  // Handle AI Chat
  const handleAIChat = async (query) => {
    if (!query || !selectedRoom) return;

    try {
      setAiProcessing(true);

      // Show user's question
      const userMessage = {
        id: `temp-user-${Date.now()}`,
        content: `@AI ${query}`,
        sender_id: user?.id,
        sender: user,
        room_id: selectedRoom.id,
        type: 'TEXT',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Call AI API with roomId and question (as required by backend)
      const response = await chatWithAI(selectedRoom.id, query);

      // Backend trả về: { status: 200, message: 'AI đã trả lời', data: { answer: '...', question: '...', aiMessage: {...}, fromCache: false } }
      console.log('AI Response:', response);

      const aiResponse = response.data?.answer ||
                         response.data?.response ||
                         response.answer ||
                         response.response ||
                         'Xin lỗi, tôi không thể trả lời câu hỏi này.';

      // Show AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender_id: 'ai-assistant',
        sender: { name: 'AI Assistant', avatar_url: null },
        room_id: selectedRoom.id,
        type: 'TEXT',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      toast.success('AI đã trả lời!');
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Không thể nhận phản hồi từ AI');
    } finally {
      setAiProcessing(false);
    }
  };

  // Handle Smart Reply Selection
  const handleSelectSmartReply = (reply) => {
    setMessageInput(reply);
  };

  // Handle Summarize
  const handleSummarize = async () => {
    if (!selectedRoom) return;

    try {
      setSummarizing(true);
      setShowSummaryModal(true);
      setSummary('');

      const response = await summarizeConversation(selectedRoom.id, 50);
      const summaryText = response.data?.summary || response.summary || 'Không thể tạo tóm tắt.';

      setSummary(summaryText);
      toast.success('Đã tạo tóm tắt thành công!');
    } catch (error) {
      console.error('Summarize error:', error);
      toast.error('Không thể tạo tóm tắt cuộc trò chuyện');
      setShowSummaryModal(false);
    } finally {
      setSummarizing(false);
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
      // Use joinRoom function from SocketContext instead of direct socket.emit
      if (connected && joinRoom) {
        joinRoom(selectedRoom.id);
      }
      setShowRoomInfo(false);
    }
  }, [selectedRoom, connected, joinRoom]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!selectedRoom) {
      toast.error('Vui lòng chọn cuộc trò chuyện trước');
      return;
    }

    try {
      // Validate file
      validateFile(file);
      setSelectedFile(file);

      // Start upload
      setUploading(true);
      setUploadProgress(0);

      const result = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Send file message
      const messageData = {
        roomId: selectedRoom.id,
        content: result.url,
        type: 'FILE',
        metadata: {
          filename: result.filename,
          mimetype: result.mimetype,
          originalName: file.name,
        },
      };

      if (socket && socket.connected) {
        sendMessage(messageData);
        toast.success('Đã gửi file thành công!');
      } else {
        toast.error('Không thể gửi file. Vui lòng kiểm tra kết nối.');
      }

      // Reset upload state
      setSelectedFile(null);
      setUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Không thể tải file lên';
      toast.error(errorMessage);
      setSelectedFile(null);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Cancel file upload
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
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

  const handleGroupCreated = async (newRoom) => {
    try {
      // Reload rooms to include the new group
      await loadRooms();
      // Select the new room
      setSelectedRoom(newRoom);
      toast.success('Đã tạo nhóm thành công!');
    } catch (error) {
      console.error('Handle group created failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleImageClick = (imageIndex) => {
    setShowImageGallery(true);
    // Set initial index for gallery - will be handled by ImageGallery component
    // We'll need to pass this to ImageGridViewer
    setTimeout(() => {
      // Trigger gallery to open at specific index
      const event = new CustomEvent('openGalleryAtIndex', { detail: { index: imageIndex } });
      window.dispatchEvent(event);
    }, 100);
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
        onGroupCreated={handleGroupCreated}
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
              onSummarize={handleSummarize}
              onShowImageGallery={() => setShowImageGallery(true)}
            />

            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--background-color)' }}>
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                loading={loading}
                messagesEndRef={messagesEndRef}
                onSelectSmartReply={handleSelectSmartReply}
                onImageClick={handleImageClick}
              />
              {aiProcessing && (
                <div className="flex items-center gap-2 text-sm p-3 rounded-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--primary-color)' }}></div>
                  <span>AI đang suy nghĩ...</span>
                </div>
              )}
            </div>

            <MessageInput
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onSubmit={handleSendMessage}
              disabled={!messageInput.trim() || aiProcessing}
              onFileSelect={handleFileSelect}
              uploading={uploading}
              uploadProgress={uploadProgress}
              selectedFile={selectedFile}
              onCancelUpload={handleCancelUpload}
              placeholder={aiProcessing ? "AI đang xử lý..." : "Nhập tin nhắn... (gõ @AI để chat với AI)"}
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

      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        summary={summary}
        loading={summarizing}
      />

      {/* Image Grid Viewer */}
      <ImageGridViewer
        messages={messages}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
      />
    </div>
  );
};

export default ChatPage;
