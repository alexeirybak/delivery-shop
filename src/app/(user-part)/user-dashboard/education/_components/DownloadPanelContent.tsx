import { useMemo } from "react";
import { Loader2, Presentation } from "lucide-react";
import Image from "next/image";
import { useDownloads } from "../../hooks/useDownloads";
import { Message } from "../../types";

interface DownloadPanelContentProps {
  messages: Message[];
}

export const DownloadPanelContent = ({
  messages,
}: DownloadPanelContentProps) => {
  const {
    downloading,
    downloadFullChat,
    downloadLastResponse,
    downloadLastResponseAsPDF,
    downloadFullChatAsPDF,
    downloadAsPresentation,
  } = useDownloads();

  const hasAssistantMessages = useMemo(
    () => messages.some((m) => m.role === "assistant" && !m.isStreaming),
    [messages],
  );

  const hasAnyMessages = useMemo(() => messages.length > 0, [messages]);

  const hasPresentation = useMemo(
    () => messages.some((m) => m.mode === "presentation"),
    [messages],
  );

  return (
    <div className="download-panel-content">
      {hasPresentation && (
        <div className="download-grid">
          <div className="grid-section">
            <h3 className="grid-title">Презентация</h3>
            <div className="grid-buttons">
              <button
                onClick={() => downloadAsPresentation(messages)}
                className="download-btn"
                disabled={downloading !== null}
                title="Скачать как презентацию"
              >
                {downloading === "presentation" ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <>
                    <Presentation size={30} />
                    <span>PPTX</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {hasAssistantMessages && (
        <div className="download-grid">
          <div className="grid-section">
            <h3 className="grid-title">Последний ответ</h3>
            <div className="grid-buttons">
              <button
                onClick={() => downloadLastResponse(messages)}
                className="download-btn"
                disabled={downloading !== null}
                title="Скачать последний ответ в Word"
              >
                {downloading === "last" ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <>
                    <Image
                      src="/icons/icon-microsoft-word.svg"
                      alt="Скачать ответ в Word"
                      width={30}
                      height={30}
                    />
                    <span>Word</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadLastResponseAsPDF(messages)}
                className="download-btn"
                disabled={downloading !== null}
                title="Скачать последний ответ в PDF"
              >
                {downloading === "last-pdf" ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <>
                    <Image
                      src="/icons/icon-pdf.svg"
                      alt="Скачать ответ в PDF"
                      width={30}
                      height={30}
                    />
                    <span>PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {hasAnyMessages && (
        <div className="download-grid">
          <div className="grid-section">
            <h3 className="grid-title">Весь чат</h3>
            <div className="grid-buttons">
              <button
                onClick={() => downloadFullChat(messages)}
                className="download-btn"
                disabled={downloading !== null}
                title="Скачать весь чат в Word"
              >
                {downloading === "full" ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <>
                    <Image
                      src="/icons/icon-microsoft-word.svg"
                      alt="Скачать чат в Word"
                      width={30}
                      height={30}
                    />
                    <span>Word</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFullChatAsPDF(messages)}
                className="download-btn"
                disabled={downloading !== null}
                title="Скачать весь чат в PDF"
              >
                {downloading === "full-pdf" ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <>
                    <Image
                      src="/icons/icon-pdf.svg"
                      alt="Скачать чат в PDF"
                      width={30}
                      height={30}
                    />
                    <span>PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
