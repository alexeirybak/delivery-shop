import { useRef, useEffect } from "react";
import { User, Bot, Copy, Check, Repeat } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SpeakButton } from "./SpeakButton";
import { formatTime } from "../utils/formatTime";
import { MessageListProps } from "../types";
import "../styles/message-list.css";
import "katex/dist/katex.min.css";

export const MessageList = ({
  messages,
  copiedId,
  onCopy,
  onRetry,
  mode,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  const visibleMessages =
    mode === "dictation"
      ? messages.filter((msg) => msg.role !== "user")
      : messages;

  if (visibleMessages.length === 0) {
    return null;
  }

  return (
    <div className="chat-messages">
      {visibleMessages.map((msg) => (
        <div key={msg.id} className={`chat-message ${msg.role}`}>
          <div className="message-avatar">
            {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
          </div>
          <div className="message-wrapper">
            <div
              className={`message-content ${msg.isStreaming ? "streaming" : ""}`}
            >
              {msg.content &&
                (msg.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <div className="user-message-text">{msg.content}</div>
                ))}
              {msg.isStreaming && <span className="cursor-blink">|</span>}
            </div>
            <div className="message-footer">
              <span className="message-time">{formatTime(msg.timestamp)}</span>
              {!msg.isStreaming && msg.content && (
                <>
                  <button
                    onClick={() => onCopy(msg.content, msg.id)}
                    className="copy-btn"
                    title="Копировать"
                  >
                    {copiedId === msg.id ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                  {msg.role === "assistant" && (
                    <SpeakButton text={msg.content} />
                  )}
                </>
              )}
              {onRetry && msg.role === "assistant" && (
                <button
                  className="retry-btn"
                  onClick={onRetry}
                  title="Повторить последний запрос"
                >
                  <Repeat size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
