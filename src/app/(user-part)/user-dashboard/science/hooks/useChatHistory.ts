import { useState, useCallback } from "react";
import { ArticleStatus, UseChatHistoryReturn } from "../types";
import { ChatData, GenerationMode, LoadedChat, Message } from "../../types";

export const useChatHistory = (): UseChatHistoryReturn => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const generateTitleFromMessage = useCallback(
    (messages: Message[]): string => {
      const firstUserMessage = messages.find((msg) => msg.role === "user");

      if (!firstUserMessage) {
        return `Чат ${new Date().toLocaleString()}`;
      }

      let title = firstUserMessage.content.trim();
      const maxLength = 50;

      if (title.length > maxLength) {
        title = title.slice(0, maxLength) + "...";
      }

      return title || `Чат ${new Date().toLocaleString()}`;
    },
    [],
  );

  const saveChatToDatabase = useCallback(
    async (
      msgs: Message[],
      mode: GenerationMode,
      chatId: string | null,
      articleStatus?: ArticleStatus,
    ): Promise<string | null> => {
      try {
        const title =
          !chatId && msgs.length > 0
            ? generateTitleFromMessage(msgs)
            : undefined;

        const response = await fetch("/api/scientific-articles/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            title,
            mode,
            articleStatus,
            messages: msgs.map((msg) => ({
              role: msg.role,
              content: msg.content,
              mode: msg.mode,
              timestamp: msg.timestamp,
              meta: msg.meta,
            })),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (!chatId && result.chatId) {
            setCurrentChatId(result.chatId);
            return result.chatId;
          }
        }
      } catch (error) {
        console.error("Ошибка сохранения чата:", error);
      }
      return chatId;
    },
    [generateTitleFromMessage],
  );

  const loadChatFromDatabase = useCallback(
    async (chatId: string): Promise<LoadedChat | null> => {
      try {
        const response = await fetch(`/api/scientific-articles/${chatId}`);
        if (!response.ok) throw new Error("Ошибка загрузки");

        const chat: ChatData = await response.json();

        const messagesWithDate: Message[] = chat.messages.map((msg) => ({
          ...msg,
          mode: msg.mode || msg.mode || chat.mode || "review",
          timestamp: new Date(msg.timestamp),
          isStreaming: false,
        }));

        setCurrentChatId(chatId);
        return {
          messages: messagesWithDate,
          mode: chat.mode || chat.mode || "review",
          articleStatus: chat.articleStatus,
        };
      } catch (error) {
        console.error("Ошибка загрузки чата:", error);
        alert("Не удалось загрузить чат");
        return null;
      }
    },
    [],
  );

  const deleteChat = useCallback(
    async (chatId: string, currentId: string | null): Promise<boolean> => {
      try {
        const response = await fetch(`/api/scientific-articles/${chatId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          if (currentId === chatId) {
            setCurrentChatId(null);
            return true;
          }
        }
      } catch (error) {
        console.error("Ошибка удаления чата:", error);
      }
      return false;
    },
    [],
  );

  const createNewChat = useCallback((): void => {
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  }, []);

  return {
    currentChatId,
    setCurrentChatId,
    isSidebarOpen,
    setIsSidebarOpen,
    saveChatToDatabase,
    loadChatFromDatabase,
    deleteChat,
    createNewChat,
  };
};
