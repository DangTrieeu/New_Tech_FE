import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Protected Route Component
 * Bảo vệ các route cần authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log("[ProtectedRoute] Checking auth:", {
    isAuthenticated,
    loading,
  });

  // Đang check auth - hiển thị loading
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p style={{ color: "var(--text-primary)" }}>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Đã check xong: nếu chưa authenticated thì redirect login
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Đã authenticated - cho render
  console.log("[ProtectedRoute] Authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;
