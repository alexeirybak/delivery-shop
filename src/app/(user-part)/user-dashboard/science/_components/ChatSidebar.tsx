import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Plus, Trash2, X, Loader2, Search } from "lucide-react";
import { ChatSidebarProps, SearchResult } from "../../types";
import { ModeIcon } from "../../_components/ModeIcon";
import { sidebarFormatDate } from "@/utils/sidebarFormatDate";
import "../../styles/chat-sidebar.css";

export const ChatSidebar = ({
  isOpen,
  onClose,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  refreshTrigger,
}: ChatSidebarProps) => {
  const [chats, setChats] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/scientific-articles/list");
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchChats = useCallback(async (query: string) => {
    if (!query.trim()) {
      await loadChats();
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch("/api/scientific-articles/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen, refreshTrigger]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        searchChats(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, searchChats]);

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Удалить этот чат?")) return;

    setDeletingId(chatId);
    await onDeleteChat(chatId);
    setDeletingId(null);
    await searchChats(searchQuery);
  };

  const getModeLabel = (mode: string): string => {
    const labels: Record<string, string> = {
      chat_science: "Чат",
      conference: "Тезисы конференции",
      review: "Обзорная статья",
      research: "Исследовательская статья",
      experimental: "Экспериментальная статья",
      methodology: "Методология",
      case: "Кейс-стади",
      literature: "Литературный обзор",
      systematic: "Систематический обзор",
      hypothesis: "Гипотеза",
    };
    return labels[mode] || mode;
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`chat-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Статьи</h2>
          <button
            onClick={onNewChat}
            className="new-chat-btn"
            title="Новая статья"
          >
            <Plus size={18} />
            <span>Новая статья</span>
          </button>
          <button onClick={onClose} className="close-sidebar-btn">
            <X size={18} />
          </button>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по чатам и сообщениям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {(searchQuery || isSearching) && (
              <button onClick={clearSearch} className="clear-search-btn">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="chat-list">
          {isLoading || isSearching ? (
            <div className="loading-chats">
              <Loader2 size={24} className="spin" />
              <span>{isSearching ? "Поиск..." : "Загрузка..."}</span>
            </div>
          ) : chats.length === 0 ? (
            <div className="empty-chats">
              <MessageSquare size={32} />
              {searchQuery ? (
                <>
                  <p>Ничего не найдено по запросу &quot;{searchQuery}&quot;</p>
                  <button onClick={clearSearch} className="empty-new-chat-btn">
                    Очистить поиск
                  </button>
                </>
              ) : (
                <>
                  <p>Нет сохраненных чатов</p>
                  <button onClick={onNewChat} className="empty-new-chat-btn">
                    Создать новый чат
                  </button>
                </>
              )}
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? "active" : ""}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="chat-icon">
                  <ModeIcon mode={chat.mode} />
                </div>
                <div className="chat-info">
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-preview">
                    {getModeLabel(chat.mode)} · {chat.messagesCount} сообщений ·{" "}
                    {sidebarFormatDate(chat.createdAt)}
                  </div>
                  {chat.matchedMessages && chat.matchedMessages.length > 0 && (
                    <div className="matched-preview">
                      {chat.matchedMessages.map((msg) => (
                        <div key={msg.id} className="matched-message">
                          <span className="match-icon">🔍</span>
                          <span
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => handleDelete(chat.id, e)}
                  className="delete-chat-btn"
                  disabled={deletingId === chat.id}
                  title="Удалить"
                >
                  {deletingId === chat.id ? (
                    <Loader2 size={14} className="spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
