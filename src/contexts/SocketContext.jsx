import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  const connectSocket = () => {
    const token = localStorage.getItem('accessToken');

    if (!token || socketRef.current) return;

    console.log('[SocketContext] Connecting to:', API_BASE_URL);
    console.log('[SocketContext] Token exists:', !!token);

    const newSocket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[SocketContext] Socket connected, ID:', newSocket.id);
      console.log('[SocketContext] Connected status:', newSocket.connected);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[SocketContext] Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[SocketContext] Socket connection error:', error.message);
      setConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log('[SocketContext] Disconnecting socket');
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    }
  };

  // Join room
  const joinRoom = (roomId) => {
    if (socket && socket.connected) {
      console.log('[SocketContext] Emitting join_room, roomId:', roomId);
      // Emit as object for consistency with send_message
      socket.emit('join_room', { roomId });

      // Verify join bằng cách log rooms hiện tại
      setTimeout(() => {
        console.log('[SocketContext] Socket rooms after join:', socket.rooms);
      }, 100);
    } else {
      console.error('[SocketContext] Cannot join room - socket not connected');
    }
  };

  // Leave room
  const leaveRoom = (roomId) => {
    if (socket) {
      console.log('[SocketContext] Emitting leave_room, roomId:', roomId);
      // Emit as object for consistency
      socket.emit('leave_room', { roomId });
    }
  };

  // Send message
  const sendMessage = (data) => {
    if (socket && socket.connected) {
      console.log('[SocketContext] Emitting send_message:', {
        roomId: data.roomId,
        content: data.content,
        type: data.type,
        socketId: socket.id,
        connected: socket.connected
      });
      socket.emit('send_message', data);
    } else {
      console.error('[SocketContext] Cannot send message - socket not connected:', {
        socketExists: !!socket,
        connected: socket?.connected
      });
    }
  };

  // Delete message
  const deleteMessage = (messageId) => {
    if (socket) {
      socket.emit('delete_message', { messageId });
    }
  };

  // Listen for messages
  const onReceiveMessage = (callback) => {
    if (socket) {
      socket.on('receive_message', callback);
      return () => socket.off('receive_message', callback);
    }
  };

  // Listen for message deleted
  const onMessageDeleted = (callback) => {
    if (socket) {
      socket.on('message_deleted', callback);
      return () => socket.off('message_deleted', callback);
    }
  };

  // Listen for typing
  const onUserTyping = (callback) => {
    if (socket) {
      socket.on('user_typing', callback);
      return () => socket.off('user_typing', callback);
    }
  };

  const value = {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    sendMessage,
    deleteMessage,
    onReceiveMessage,
    onMessageDeleted,
    onUserTyping,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
