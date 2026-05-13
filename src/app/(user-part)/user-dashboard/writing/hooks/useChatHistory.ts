import { useState, useCallback } from "react";
import { GenerationMode, Message } from "../../types";
import { modes } from "../utils/modesWriting";
import { ChatData, LoadedChat} from "../../types/chat.types";
import { UseChatHistoryReturn, WritingMode } from "../types";

export const useChatHistory = (): UseChatHistoryReturn => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const saveChatToDatabase = useCallback(
    async (
      msgs: Message[],
      mode: GenerationMode,
      chatId: string | null,
    ): Promise<string | null> => {
      if (!msgs || msgs.length === 0) return chatId;

      try {
        let title: string | undefined;

        if (!chatId && msgs.length > 0) {
          const firstUserMessage = msgs.find((msg) => msg.role === "user");

          if (firstUserMessage) {
            const modeLabel = modes[mode as WritingMode]?.label || "Чат";

            let content = firstUserMessage.content.trim();
            const maxLength = 50;

            if (content.length > maxLength) {
              content = content.slice(0, maxLength) + "...";
            }

            title = content ? `${modeLabel}: ${content}` : modeLabel;
          } else {
            title = `Чат ${new Date().toLocaleString()}`;
          }
        }

        const response = await fetch("/api/writing/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            title,
            mode,
            messages: msgs.map((msg) => ({
              id: msg.id,
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
    [],
  );

  const loadChatFromDatabase = useCallback(
    async (chatId: string): Promise<LoadedChat | null> => {
      try {
        const response = await fetch(`/api/writing/${chatId}`);
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
        const response = await fetch(`/api/writing/${chatId}`, {
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
