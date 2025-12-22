import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Protected Route Component
 * Bảo vệ các route cần authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Kiểm tra localStorage trước (cho trường hợp OAuth redirect)
  const hasToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminAccessToken");

  console.log("[ProtectedRoute] State:", {
    isAuthenticated,
    loading,
    hasToken: !!hasToken,
  });

  // Đang check auth
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p style={{ color: "var(--text-primary)" }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập VÀ không có token -> redirect về login
  if (!isAuthenticated && !hasToken) {
    console.log("[ProtectedRoute] No auth, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Có token nhưng chưa authenticated -> đang loading, cho render
  // (AuthProvider sẽ tự động fetch user data)
  return children;
};

export default ProtectedRoute;
