import { Send, Square } from "lucide-react";
import { SendButtonProps } from "../types";
import "../styles/send-button.css";

export const SendButton = ({
  isGenerating,
  onSend,
  onStop,
  disabled = false,
  hasContent,
}: SendButtonProps) => {
  if (isGenerating) {
    return (
      <button
        onClick={onStop}
        className="stop-btn"
        title="Остановить генерацию"
      >
        <Square size={20} fill="currentColor" />
      </button>
    );
  }

  return (
    <button
      onClick={onSend}
      disabled={disabled || !hasContent}
      className="send-btn"
      title="Отправить"
    >
      <Send size={20} />
    </button>
  );
};
