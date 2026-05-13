import { useState } from "react";
import { downloadAsWord } from "../utils/downloadAsWord";
import { downloadAsPPTX } from "../utils/downloadAsPPTX";
import { getLocalDateTime } from "../utils/getLocalDateTime";
import { Message } from "../types";
import { downloadAsPDF } from "../utils/downloadAsPDF";

const convertMarkdownToHtml = (content: string): string => {
  let html = content;

  html = html.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/^- (.*?)$/gm, "<li>$1</li>");

  const lines = html.split("\n");
  const processedLines = [];
  let inList = false;

  for (const line of lines) {
    if (line.trim() === "") {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (line.match(/^<h[1-3]>/)) {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      processedLines.push(line);
      continue;
    }

    if (line.match(/^<li>/)) {
      if (!inList) {
        processedLines.push("<ul>");
        inList = true;
      }
      processedLines.push(line);
      continue;
    }

    if (inList) {
      processedLines.push("</ul>");
      inList = false;
    }

    if (line.trim() !== "") {
      processedLines.push(`<p>${line}</p>`);
    }
  }

  if (inList) {
    processedLines.push("</ul>");
  }

  html = processedLines.join("");

  return html;
};

const convertMessageToHtml = (
  content: string,
  role: string,
  timestamp: Date,
): string => {
  const header = role === "user" ? "ПОЛЬЗОВАТЕЛЬ" : "АССИСТЕНТ";
  const time = timestamp.toLocaleString();
  const convertedContent = convertMarkdownToHtml(content);

  return `
    <div class="message">
      <div class="message-header">
        <strong>${header}</strong>
        <span class="message-time">(${time})</span>
      </div>
      <div class="message-body">
        ${convertedContent}
      </div>
      <hr class="message-divider" />
    </div>
  `;
};

const formatChatToHtml = (messages: Message[]): string => {
  return messages
    .filter((m) => !m.isStreaming)
    .map((msg) => {
      return convertMessageToHtml(msg.content, msg.role, msg.timestamp);
    })
    .join("");
};

export const useDownloads = () => {
  const [downloading, setDownloading] = useState<
    "full" | "last" | "presentation" | "last-pdf" | "full-pdf" | null
  >(null);

  const downloadFullChat = (messages: Message[]) => {
    if (messages.length === 0) return;
    setDownloading("full");

    const chatContent = formatChatToHtml(messages);
    const filename = `Чат_${getLocalDateTime()}`;
    downloadAsWord(chatContent, filename);
    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadLastResponse = (messages: Message[]) => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant" && !msg.isStreaming);
    if (!lastAssistantMessage) {
      alert("Нет ответов для скачивания");
      return;
    }
    setDownloading("last");

    const convertedContent = convertMarkdownToHtml(
      lastAssistantMessage.content,
    );
    const filename = `Ответ_${getLocalDateTime()}`;
    downloadAsWord(convertedContent, filename);
    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadLastResponseAsPDF = (messages: Message[]) => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant" && !msg.isStreaming);
    if (!lastAssistantMessage) {
      alert("Нет ответов для скачивания");
      return;
    }
    setDownloading("last-pdf");

    const convertedContent = convertMarkdownToHtml(
      lastAssistantMessage.content,
    );
    const filename = `Ответ_${getLocalDateTime()}`;
    downloadAsPDF(convertedContent, filename);

    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadFullChatAsPDF = (messages: Message[]) => {
    setDownloading("full-pdf");

    const chatContent = formatChatToHtml(messages);
    const filename = `Чат_${getLocalDateTime()}`;

    downloadAsPDF(chatContent, filename);

    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadAsPresentation = (messages: Message[]) => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant" && !msg.isStreaming);
    if (!lastAssistantMessage) {
      alert("Нет лекции для скачивания");
      return;
    }
    setDownloading("presentation");

    const convertedContent = convertMarkdownToHtml(
      lastAssistantMessage.content,
    );
    const filename = `Презентация_${getLocalDateTime()}`;
    downloadAsPPTX(convertedContent, filename);
    setTimeout(() => setDownloading(null), 1000);
  };

  return {
    downloading,
    downloadFullChat,
    downloadLastResponse,
    downloadLastResponseAsPDF,
    downloadFullChatAsPDF,
    downloadAsPresentation,
  };
};
