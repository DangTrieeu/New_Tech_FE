import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * OAuth Success Page
 * Handles the callback after Google OAuth authentication
 * Backend redirects here with tokens in URL params
 */
const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleAuthSuccess } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Đọc tokens từ URL params
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const userStr = searchParams.get("user");

        console.log("[OAuthSuccess] URL Params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!userStr,
        });

        if (!accessToken) {
          throw new Error("Không tìm thấy access token trong URL");
        }

        // Parse user data
        let userData = null;
        if (userStr) {
          try {
            userData = JSON.parse(decodeURIComponent(userStr));
            console.log("[OAuthSuccess] User data parsed:", userData);
          } catch (e) {
            console.error("Failed to parse user data:", e);
            throw new Error("Không thể parse dữ liệu người dùng");
          }
        }

        if (!userData) {
          throw new Error("Không có thông tin người dùng từ backend");
        }

        // Lưu tokens vào localStorage
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        console.log("[OAuthSuccess] Tokens saved to localStorage");
        console.log("[OAuthSuccess] Calling handleGoogleAuthSuccess...");

        // Call handleGoogleAuthSuccess với user data
        await handleGoogleAuthSuccess(accessToken, userData);

        console.log(
          "[OAuthSuccess] Auth complete! Waiting for state update..."
        );

        // Đợi đủ lâu để React flush state updates và re-render
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("[OAuthSuccess] Navigating to chat...");

        // Navigate
        navigate("/chat", { replace: true });
      } catch (err) {
        console.error("[OAuthSuccess] Error:", err);
        setError(`Xác thực thất bại: ${err.message}`);

        // Redirect to login after error
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    };

    processOAuthCallback();
  }, [handleGoogleAuthSuccess, navigate, searchParams]);

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <div className="text-center p-8">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-lg" style={{ color: "var(--text-primary)" }}>
            {error}
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Đang chuyển hướng về trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg" style={{ color: "var(--text-primary)" }}>
          Đang xác thực với Google...
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
          Vui lòng đợi một chút
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;
