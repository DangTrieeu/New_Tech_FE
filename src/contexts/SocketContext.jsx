import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const token =
      localStorage.getItem("adminAccessToken") ||
      localStorage.getItem("accessToken");

    console.log("[SocketContext] Auth state or token changed:", {
      isAuthenticated,
      hasToken: !!token,
      userExists: !!user,
      userName: user?.name,
      userRole: user?.role,
    });

    if (isAuthenticated && token) {
      connectSocket();
    } else {
      console.log("[SocketContext] Not connecting - no auth or token");
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]); // Removed 'user' to prevent unnecessary reconnects

  const connectSocket = () => {
    const token =
      localStorage.getItem("adminAccessToken") ||
      localStorage.getItem("accessToken");

    console.log("[SocketContext] Attempting to connect socket:", {
      hasToken: !!token,
      socketExists: !!socketRef.current,
      socketAlreadyConnected: socketRef.current?.connected,
      token: token ? `${token.substring(0, 20)}...` : "null",
    });

    if (!token) {
      console.error("[SocketContext] Cannot connect - no token found");
      return;
    }

    if (socketRef.current) {
      if (socketRef.current.connected) {
        console.log("[SocketContext] Socket already connected, skipping");
        return;
      } else {
        console.log(
          "[SocketContext] Socket exists but not connected, cleaning up..."
        );
        disconnectSocket();
      }
    }

    console.log("[SocketContext] Creating new socket connection...");
    const newSocket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log(
        "[SocketContext] ✅ Socket connected successfully, ID:",
        newSocket.id
      );
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("[SocketContext] ❌ Socket disconnected");
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("[SocketContext] Socket connection error:", error.message);
      setConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    console.log("[SocketContext] Socket instance created and stored in refs");
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log("[SocketContext] Disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    }
  };

  // Join room
  const joinRoom = (roomId) => {
    console.log("[SocketContext] joinRoom called:", {
      roomId,
      socketExists: !!socket,
      socketConnected: socket?.connected,
    });

    if (socket && socket.connected) {
      socket.emit("join_room", { roomId });
      console.log("[SocketContext] Emitted join_room event");
    } else {
      console.error("[SocketContext] Cannot join room - socket not connected");
    }
  };

  // Leave room
  const leaveRoom = (roomId) => {
    if (socket) {
      // Emit as object for consistency
      socket.emit("leave_room", { roomId });
    }
  };

  // Send message
  const sendMessage = (data) => {
    console.log("[SocketContext] sendMessage called:", {
      data,
      socketExists: !!socket,
      socketConnected: socket?.connected,
    });

    if (socket && socket.connected) {
      socket.emit("send_message", data);
      console.log("[SocketContext] Emitted send_message event");
    } else {
      console.error(
        "[SocketContext] Cannot send message - socket not connected:",
        {
          socketExists: !!socket,
          connected: socket?.connected,
        }
      );
    }
  };

  // Delete message
  const deleteMessage = (messageId) => {
    if (socket) {
      socket.emit("delete_message", { messageId });
    }
  };

  // Listen for messages
  const onReceiveMessage = (callback) => {
    if (socket) {
      socket.on("receive_message", callback);
      return () => socket.off("receive_message", callback);
    }
  };

  // Listen for message deleted
  const onMessageDeleted = (callback) => {
    if (socket) {
      socket.on("message_deleted", callback);
      return () => socket.off("message_deleted", callback);
    }
  };

  // Listen for typing
  const onUserTyping = (callback) => {
    if (socket) {
      socket.on("user_typing", callback);
      return () => socket.off("user_typing", callback);
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
