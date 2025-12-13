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

    const newSocket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    }
  };

  // Join room
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', { roomId });
      console.log('Joined room:', roomId);
    }
  };

  // Leave room
  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', { roomId });
      console.log('Left room:', roomId);
    }
  };

  // Send message
  const sendMessage = (data) => {
    if (socket) {
      socket.emit('send_message', data);
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
