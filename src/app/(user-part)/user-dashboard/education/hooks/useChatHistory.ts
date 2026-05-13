import { useState, useCallback } from "react";
import { ChatData, GenerationMode, LoadedChat, Message } from "../../types";
import { UseChatHistoryReturn } from "../types";

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
    ): Promise<string | null> => {
      if (!msgs || msgs.length === 0) return chatId;

      try {
        const title =
          !chatId && msgs.length > 0
            ? generateTitleFromMessage(msgs)
            : undefined;

        const response = await fetch("/api/education/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            title,
            mode,
            messages: msgs.map((msg) => ({
              role: msg.role,
              content: msg.content,
              images: msg.images,
              mode: msg.mode,
              timestamp: msg.timestamp,
            })),
          }),
        });

        if (response.ok) {
          const result = await response.json();

          if (!chatId && result.chatId) {
            setCurrentChatId(result.chatId);
            return result.chatId;
          }

          return chatId;
        } else {
          throw new Error("Ошибка сохранения");
        }
      } catch (error) {
        console.error("Ошибка сохранения чата:", error);
        return chatId;
      }
    },
    [generateTitleFromMessage],
  );

  const loadChatFromDatabase = useCallback(
    async (chatId: string): Promise<LoadedChat | null> => {
      try {
        const response = await fetch(`/api/education/${chatId}`);
        if (!response.ok) throw new Error("Ошибка загрузки");

        const chat: ChatData = await response.json();

        const messagesWithDate: Message[] = chat.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          isStreaming: false,
        }));

        setCurrentChatId(chatId);
        return { messages: messagesWithDate, mode: chat.mode };
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
        const response = await fetch(`/api/education/${chatId}`, {
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
