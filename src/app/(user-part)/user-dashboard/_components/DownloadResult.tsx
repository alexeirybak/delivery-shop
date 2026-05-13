import { useState, useMemo } from "react";
import { ChevronLeft, FileDown } from "lucide-react";
import { DownloadPanelContent } from "../education/_components/DownloadPanelContent";
import { Message } from "../types";
import "../styles/download-panel.css";

interface DownloadResultProps {
  messages: Message[];
}

export const DownloadResult = ({
  messages,
}: DownloadResultProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasAssistantMessages = useMemo(
    () => messages.some((m) => m.role === "assistant" && !m.isStreaming),
    [messages],
  );

  const hasAnyMessages = useMemo(() => messages.length > 0, [messages]);

  const hasAnyContent = hasAssistantMessages || hasAnyMessages;

  return (
    <>
      {hasAnyContent && (
        <button
          className={`download-toggle ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Открыть панель инструментов"
        >
          Скачать
          {isOpen ? <ChevronLeft size={24} /> : <FileDown size={24} />}
        </button>
      )}

      <div className={`download-panel ${isOpen ? "open" : ""}`}>
        <DownloadPanelContent messages={messages} />
      </div>
    </>
  );
};
