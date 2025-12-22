import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getCookie } from "@/utils/cookies";

/**
 * OAuth Success Page
 * Handles the callback after Google OAuth authentication
 * Backend redirects here after setting cookies
 */
const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const { handleGoogleAuthSuccess } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Đợi một chút để đảm bảo cookies đã được set
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Đọc accessToken từ cookie (backend đã set cookie, không httpOnly)
        const accessToken = getCookie("accessToken");
        const refreshToken = getCookie("refreshToken");

        console.log("[OAuthSuccess] Cookies:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
        });

        if (!accessToken) {
          throw new Error("Không tìm thấy access token trong cookies");
        }

        // Lưu tokens vào localStorage để dễ quản lý
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Call handleGoogleAuthSuccess - sẽ fetch user profile từ API
        await handleGoogleAuthSuccess(accessToken);

        // Redirect to chat page
        setTimeout(() => {
          navigate("/chat", { replace: true });
        }, 500);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Xác thực thất bại. Vui lòng thử lại.");

        // Redirect to login after error
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    };

    processOAuthCallback();
  }, [handleGoogleAuthSuccess, navigate]);

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
