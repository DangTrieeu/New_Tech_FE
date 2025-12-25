import React, { useRef } from "react";
import { FileText, Download, Image as ImageIcon, Reply, RotateCcw } from "lucide-react";
import SmartReplyButton from "@/components/molecules/SmartReplyButton/SmartReplyButton";
import {
  shouldGroupMessages,
  shouldShowDateSeparator,
  formatDateSeparator,
  formatMessageTime,
} from "@/utils/dateUtils";

const MessageList = ({
  messages,
  currentUserId,
  loading,
  messagesEndRef,
  onSelectSmartReply,
  onImageClick,
  onReply,
  onRecall,
}) => {
  const messagesRef = useRef({});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: "var(--text-secondary)" }}>Chưa có tin nhắn nào</p>
      </div>
    );
  }

  // Scroll to a specific message
  const scrollToMessage = (messageId) => {
    const element = messagesRef.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight");
      setTimeout(() => element.classList.remove("highlight"), 2000);
    }
  };

  // Helper function to check if URL is an image
  const isImageUrl = (url) => {
    if (!url) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    const urlLower = url.toLowerCase();
    return imageExtensions.some((ext) => urlLower.includes(ext));
  };

  // Helper function to get file name from URL or metadata
  const getFileName = (msg) => {
    if (msg.metadata?.originalName) return msg.metadata.originalName;
    if (msg.metadata?.filename) return msg.metadata.filename;
    if (msg.content) {
      const parts = msg.content.split("/");
      return parts[parts.length - 1];
    }
    return "File";
  };

  // Helper function to get image index for gallery
  const getImageIndex = (messageId) => {
    const imageMessages = messages.filter(
      (msg) => msg.type === "FILE" && msg.content && isImageUrl(msg.content)
    );
    return imageMessages.findIndex((msg) => msg.id === messageId);
  };

  // Render message content based on type
  const renderMessageContent = (msg) => {
    const isOwn = msg.user_id === currentUserId;

    // Recalled message
    if (msg.is_recalled) {
      return (
        <div className="recalled-message flex items-center gap-2 py-2 px-3" style={{
          backgroundColor: 'var(--hover-color)',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
          borderRadius: '8px'
        }}>
          <RotateCcw className="w-4 h-4" />
          <span>Tin nhắn đã được thu hồi</span>
          {msg.recalled_at && (
            <span className="text-xs ml-auto">
              {formatMessageTime(msg.recalled_at)}
            </span>
          )}
        </div>
      );
    }

    // FILE type message
    if (msg.type === "FILE" && msg.content) {
      const isImage = isImageUrl(msg.content);
      const fileName = getFileName(msg);

      if (isImage) {
        // Render image - NO background, NO padding, clickable to open gallery
        return (
          <div className="space-y-2">
            <div className="rounded-lg overflow-hidden">
              <img
                src={msg.content}
                alt={fileName}
                className="cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                onClick={() => {
                  if (onImageClick) {
                    const imageIndex = getImageIndex(msg.id);
                    onImageClick(imageIndex >= 0 ? imageIndex : 0);
                  } else {
                    window.open(msg.content, "_blank");
                  }
                }}
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  objectFit: "contain",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <a
              href={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{
                color: isOwn ? "rgba(255,255,255,0.9)" : "var(--primary-color)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ImageIcon className="w-3 h-3" />
              {fileName}
            </a>
          </div>
        );
      } else {
        // Render file (PDF, DOC, etc)
        return (
          <a
            href={msg.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: isOwn
                ? "rgba(255,255,255,0.1)"
                : "var(--hover-color)",
              minWidth: "200px",
            }}
          >
            <div
              className="p-2 rounded"
              style={{
                backgroundColor: isOwn
                  ? "rgba(255,255,255,0.2)"
                  : "var(--background-color)",
              }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs opacity-75">Click để tải xuống</p>
            </div>
            <Download className="w-4 h-4 flex-shrink-0" />
          </a>
        );
      }
    }

    // TEXT type message or default
    return <p className="break-words whitespace-pre-wrap">{msg.content}</p>;
  };

  return (
    <div className="p-4">

      {messages.map((msg, index) => {
        const isOwn = msg.user_id === currentUserId;
        const previousMsg = index > 0 ? messages[index - 1] : null;
        const shouldGroup = shouldGroupMessages(msg, previousMsg);
        const showDateSeparator = shouldShowDateSeparator(msg, previousMsg);

        // Check if this is an image message
        const isImageMessage =
          msg.type === "FILE" && msg.content && isImageUrl(msg.content);

        return (
          <React.Fragment key={msg.id}>
            {/* Date Separator - Show after 6 hours gap */}
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "var(--surface-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {formatDateSeparator(msg.created_at)}
                </div>
              </div>
            )}

            {/* Message */}
            <div
              ref={(el) => (messagesRef.current[msg.id] = el)}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
                shouldGroup ? "mb-1" : "mb-3 mt-3"
              } group`}
            >
              <div
                className={`max-w-[70%] ${
                  isOwn ? "items-end" : "items-start"
                } flex flex-col`}
              >
                {/* Show sender name only if not grouped and not own message */}
                {!isOwn && !shouldGroup && (
                  <p
                    className="text-xs mb-1 px-2 font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {msg.user?.name ||
                      msg.sender?.name ||
                      (msg.user_id === null ? "AI Assistant" : "Unknown")}
                  </p>
                )}

                {/* Message bubble - NO background/padding for images */}
                <div
                  className={`${
                    isImageMessage || msg.is_recalled
                      ? ""
                      : `px-4 py-2 ${
                          shouldGroup ? "rounded-2xl" : "rounded-2xl"
                        }`
                  }`}
                  style={
                    isImageMessage || msg.is_recalled
                      ? {}
                      : {
                          backgroundColor: isOwn
                            ? "var(--primary-color)"
                            : "var(--surface-color)",
                          color: isOwn ? "#fff" : "var(--text-primary)",
                          opacity: msg.status === "sending" ? 0.7 : 1,
                        }
                  }
                >
                  {/* Reply preview - shown above message content */}
                  {msg.replyToMessage && !msg.is_recalled && (
                    <div
                      className="reply-preview mb-2 p-2 rounded cursor-pointer border-l-2"
                      style={{
                        backgroundColor: isOwn ? 'rgba(255,255,255,0.1)' : 'var(--hover-color)',
                        borderColor: 'var(--primary-color)',
                      }}
                      onClick={() => scrollToMessage(msg.replyToMessage.id)}
                    >
                      <div className="text-xs font-semibold mb-1" style={{
                        color: isOwn ? 'rgba(255,255,255,0.9)' : 'var(--primary-color)'
                      }}>
                        {msg.replyToMessage.user?.name || 'Unknown'}
                      </div>
                      <div className="text-sm opacity-80 truncate">
                        {msg.replyToMessage.is_recalled
                          ? '🚫 Tin nhắn đã thu hồi'
                          : msg.replyToMessage.content
                        }
                      </div>
                    </div>
                  )}

                  {/* Message content */}
                  {renderMessageContent(msg)}
                </div>

                {/* Show time, actions and Smart Reply button */}
                {(() => {
                  const nextMsg =
                    index < messages.length - 1 ? messages[index + 1] : null;
                  const groupedWithNext =
                    nextMsg && shouldGroupMessages(nextMsg, msg, currentUserId);

                  if (!groupedWithNext) {
                    // Check if message is from database (numeric ID) and not AI or temp message
                    const msgIdStr = String(msg.id);
                    const isRealMessage =
                      !msgIdStr.startsWith("temp-") &&
                      !msgIdStr.startsWith("ai-");
                    const isAIMessage =
                      msg.user_id === null || msg.type === "AI";

                    return (
                      <div className="flex items-center gap-2 mt-1 px-2">
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {formatMessageTime(msg.created_at)}
                          {msg.status === "sending" && " • Đang gửi..."}
                        </p>

                        {/* Message actions - only for real non-recalled messages */}
                        {isRealMessage && !msg.is_recalled && (
                          <div className="message-actions flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Reply button - for all messages */}
                            {onReply && (
                              <button
                                onClick={() => onReply(msg)}
                                className="p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                                title="Trả lời"
                              >
                                <Reply className="w-4 h-4" />
                              </button>
                            )}

                            {/* Recall button - only for own messages */}
                            {isOwn && onRecall && (
                              <button
                                onClick={() => onRecall(msg.id)}
                                className="p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                                title="Thu hồi"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Show Smart Reply button only for real messages from other users (not AI, not temp) */}
                        {!isOwn &&
                          msg.type === "TEXT" &&
                          onSelectSmartReply &&
                          isRealMessage &&
                          !isAIMessage &&
                          !msg.is_recalled && (
                            <SmartReplyButton
                              messageId={msg.id}
                              onSelectReply={onSelectSmartReply}
                            />
                          )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
