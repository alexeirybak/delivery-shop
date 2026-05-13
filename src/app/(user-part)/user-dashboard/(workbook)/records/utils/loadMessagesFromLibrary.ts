import { Message } from "../../../types";
import { RecordFormData } from "../types";

interface LoadMessagesFromLibraryParams {
  materialId: string;
  updateFormField: (
    field: keyof RecordFormData,
    value: string | boolean,
  ) => void;
  setCurrentRecordId: (id: string | null) => void;
  setNotification: (
    notification: { type: "success" | "error"; message: string } | null,
  ) => void;
  setIsLoadingFromLibrary: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const loadMessagesFromLibrary = async ({
  materialId,
  updateFormField,
  setCurrentRecordId,
  setNotification,
  setIsLoadingFromLibrary,
  setInitialized,
}: LoadMessagesFromLibraryParams) => {
  setIsLoadingFromLibrary(true);
  try {
    const response = await fetch(`/api/chats/${materialId}`);
    if (response.ok) {
      const data = await response.json();
      const messages = data.messages || [];

      if (messages.length > 0) {
        const htmlContent = messages
          .map((msg: Message) => {
            const header = msg.role === "user" ? "Пользователь" : "Ассистент";
            const content = msg.content.replace(/\n/g, "<br>");
            return `
              <div style="margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
                <strong style="color: ${msg.role === "user" ? "#4a90e2" : "#2ecc71"};">${header}:</strong>
                <div style="margin-top: 8px;">${content}</div>
              </div>
            `;
          })
          .join("");

        updateFormField("name", data.title || "Из библиотеки");
        updateFormField("content", htmlContent);
        updateFormField(
          "description",
          `Перенесено из библиотеки (${data.mode || "материал"})`,
        );
        setCurrentRecordId(null);
      } else {
        setNotification({
          type: "error",
          message: "В материале нет сообщений для переноса",
        });
      }
    } else {
      setNotification({
        type: "error",
        message: "Не удалось загрузить материал из библиотеки",
      });
    }
  } catch (error) {
    console.error("Ошибка загрузки материала:", error);
    setNotification({
      type: "error",
      message: "Ошибка при загрузке материала",
    });
  } finally {
    setIsLoadingFromLibrary(false);
    setInitialized(true);
  }
};
