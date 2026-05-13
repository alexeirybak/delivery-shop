import { useCallback } from "react";
import { VoiceInput } from "../../_components/VoiceInput";
import { TextArea } from "../../_components/TextArea";
import { SendButton } from "../../_components/SendButton";
import { Plus, X } from "lucide-react";
import { ChatInputProps } from "../../types";
import "../../styles/chat-input.css";
import { DownloadResult } from "../../_components/DownloadResult";

export const ChatInput = ({
  input,
  setInput,
  isGenerating,
  onSend,
  onStop,
  placeholder,
  disabled = false,
  onNewChat,
  messages,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSend();
      }
    }
  };

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      setInput(input + (input ? " " : "") + text);
    },
    [input, setInput],
  );

  const hasContent = input.trim().length > 0;

  const handleClearInput = useCallback(() => {
    setInput("");
  }, [setInput]);

  return (
    <div className="chat-input">
      <div className="input-wrapper">
        <div className="buttons-wrapper">
          <button
            onClick={onNewChat}
            className="new-chat-bottom-btn"
            title="Новая статья"
          >
            <Plus size={18} />
            <span>Новая статья</span>
          </button>
          <DownloadResult messages={messages} />
        </div>

        <div className="textarea-wrapper">
          <TextArea
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <div className="actions-overlay">
          <SendButton
            isGenerating={isGenerating}
            onSend={onSend}
            onStop={onStop}
            disabled={disabled}
            hasContent={hasContent}
          />
          <div className="actions-group">
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              disabled={isGenerating}
            />
            <button
              onClick={handleClearInput}
              className="clear-input-btn"
              title="Очистить текст"
              type="button"
              disabled={!input}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
