import { getLocalDateTime } from "./getLocalDateTime";
import { Message } from "../types";
import { downloadAsPDF } from "./downloadAsPDF";

export const downloadFullChatAsPDF = (messages: Message[]) => {
  if (messages.length === 0) return;

  const chatContent = messages
    .filter((m) => !m.isStreaming)
    .map((msg) => {
      const header = msg.role === "user" ? "ПОЛЬЗОВАТЕЛЬ" : "АССИСТЕНТ";
      const time = msg.timestamp.toLocaleString();
      return `${header} (${time}):\n${msg.content}\n\n${"─".repeat(50)}\n\n`;
    })
    .join("");

  const filename = `Чат_${getLocalDateTime()}`;
  downloadAsPDF(chatContent, filename);
};
