import {
  Star,
  Trash2,
  ArrowRight,
  FileText,
  FileDown,
  Loader2,
  NotebookPen,
} from "lucide-react";
import { DashboardChat, Message } from "../types";
import { getModeIcon } from "../utils/getModeIcon";
import { getModeColor } from "../utils/getModeColor";
import { getModeLabel } from "../utils/getModeLabel";
import { formatDate } from "../utils/formatDate";
import { useDownloads } from "../hooks/useDownloads";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collectionTypes } from "../utils/collectionTypes";
import { modeConfig } from "@/utils/modeConfig";

interface LibraryCardProps {
  material: DashboardChat;
  viewMode: "grid" | "list";
  isFavorited: boolean;
  onFavoriteChange: () => void;
  onMaterialDeleted: () => void;
}

const HIDE_DOWNLOAD_TYPES = ["audio"];
const HIDE_WORKBOOK_TYPES = ["visualizations"];

export const LibraryCard = ({
  material,
  viewMode,
  isFavorited,
  onFavoriteChange,
  onMaterialDeleted,
}: LibraryCardProps) => {
  const router = useRouter();
  const modeColor = getModeColor(material.mode);
  const ModeIconComponent = getModeIcon(material.mode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessagesForWord, setIsLoadingMessagesForWord] =
    useState(false);
  const [isLoadingMessagesForPDF, setIsLoadingMessagesForPDF] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);

  const isSolutionBook = material.mode === "solution_book";
  const isVisualization = material.sourceCollection === "visualizations";
  const hideDownloadButtons = HIDE_DOWNLOAD_TYPES.includes(
    material.sourceCollection || "",
  );
  const hideWorkbookButton =
    HIDE_WORKBOOK_TYPES.includes(material.sourceCollection || "") ||
    isSolutionBook;

  const { downloading, downloadFullChat, downloadFullChatAsPDF } =
    useDownloads();

  useEffect(() => {
    setLocalIsFavorited(isFavorited);
  }, [isFavorited]);

  const loadMessages = async (): Promise<Message[]> => {
    if (messages.length > 0) return messages;

    const response = await fetch(`/api/chats/${material.id}`);
    if (response.ok) {
      const data = await response.json();
      const loadedMessages = data.messages || [];
      setMessages(loadedMessages);
      return loadedMessages;
    }
    throw new Error("Ошибка загрузки сообщений");
  };

  const handleDownloadWord = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLoadingMessagesForWord(true);
    try {
      const loadedMessages = await loadMessages();
      if (loadedMessages.length > 0) {
        downloadFullChat(loadedMessages);
      } else {
        alert("Нет сообщений для скачивания");
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
      alert("Ошибка загрузки сообщений");
    } finally {
      setIsLoadingMessagesForWord(false);
    }
  };

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLoadingMessagesForPDF(true);
    try {
      const loadedMessages = await loadMessages();
      if (loadedMessages.length > 0) {
        downloadFullChatAsPDF(loadedMessages);
      } else {
        alert("Нет сообщений для скачивания");
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
      alert("Ошибка загрузки сообщений");
    } finally {
      setIsLoadingMessagesForPDF(false);
    }
  };

  const handleMoveToWorkbook = (e: React.MouseEvent) => {
    e.stopPropagation();

    router.push(`/user-dashboard/records?id=${material.id}&source=library`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Удалить этот материал?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/chats/${material.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onMaterialDeleted();
      } else {
        alert("Ошибка при удалении");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка при удалении");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavoriting(true);

    try {
      if (localIsFavorited) {
        const response = await fetch(
          `/api/chats/favorites?materialId=${material.id}`,
          { method: "DELETE" },
        );
        if (response.ok) {
          setLocalIsFavorited(false);
          onFavoriteChange();
        } else {
          alert("Не удалось удалить из избранного");
        }
      } else {
        const response = await fetch("/api/chats/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materialId: material.id,
            sourceCollection: material.sourceCollection,
          }),
        });
        if (response.ok || response.status === 409) {
          setLocalIsFavorited(true);
          onFavoriteChange();
        } else {
          alert("Не удалось добавить в избранное");
        }
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
      alert("Произошла ошибка");
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleOpen = () => {
    const config = modeConfig[material.mode];
    const basePath =
      config?.link ||
      `/user-dashboard/${material.sourceCollection || "education"}`;

    const params = new URLSearchParams({
      mode: material.mode,
      type: material.sourceCollection || "education",
      id: material.id,
    });

    router.push(`${basePath}?${params.toString()}`);
  };

  const isWordLoading = downloading === "full" || isLoadingMessagesForWord;
  const isPDFLoading = downloading === "full-pdf" || isLoadingMessagesForPDF;

  return (
    <div className={`library-card ${viewMode === "list" ? "list-view" : ""}`}>
      <div className="library-card-content">
        <div className="library-card-main">
          <div className="library-card-header">
            <div
              className="library-icon"
              style={{
                backgroundColor: `${modeColor}15`,
                color: modeColor,
              }}
            >
              <ModeIconComponent className="w-5 h-5" />
            </div>
            <div className="library-actions">
              <button
                className={`library-action favorite ${localIsFavorited ? "active" : ""}`}
                onClick={handleFavoriteToggle}
                disabled={isFavoriting}
                title={
                  localIsFavorited ? "Удалить из избранного" : "В избранное"
                }
              >
                {isFavoriting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Star
                    className={`w-4 h-4 ${localIsFavorited ? "fill-current" : ""}`}
                  />
                )}
              </button>

              {!hideDownloadButtons && !isVisualization && (
                <>
                  <button
                    className="library-action"
                    onClick={handleDownloadWord}
                    disabled={isWordLoading}
                    title={
                      isSolutionBook
                        ? "Для корректного отображения формул рекомендуется сначала скачать в PDF, затем конвертировать в Word"
                        : "Скачать в Word"
                    }
                  >
                    {isWordLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    className="library-action"
                    onClick={handleDownloadPDF}
                    disabled={isPDFLoading}
                    title="Скачать в PDF"
                  >
                    {isPDFLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}

              {!hideWorkbookButton && (
                <button
                  className="library-action"
                  onClick={handleMoveToWorkbook}
                  title="Перенести в рабочую тетрадь"
                >
                  <NotebookPen className="w-4 h-4" />
                </button>
              )}

              <button
                className="library-action delete"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Удалить"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <h3 className="library-card-title">{material.title}</h3>

          {viewMode === "list" && material.lastMessage && (
            <p className="library-preview">{material.lastMessage}...</p>
          )}
        </div>

        <div className="library-card-footer">
          <div className="library-meta">
            <span className="library-type" style={{ color: modeColor }}>
              {getModeLabel(material.mode)}
            </span>
            {material.sourceCollection && (
              <span className="library-source">
                {
                  collectionTypes.find(
                    (t) => t.id === material.sourceCollection,
                  )?.label
                }
              </span>
            )}
            <span className="library-date">
              Обновлен: {formatDate(material.updatedAt.toString())}
            </span>
            <span className="library-stats">
              {material.messagesCount} сообщений
            </span>
          </div>
          <button className="library-open-btn" onClick={handleOpen}>
            Открыть
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};
