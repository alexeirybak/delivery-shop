import { useState, useCallback, useRef } from "react";
import { EducationMode } from "../types";
import { modes } from "../utils/modesEducation";
import { Message, UploadedImage } from "../../types";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<EducationMode>("chat_education");
  const [showLoader, setShowLoader] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentMode = modes[mode];

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setShowLoader(false);
    setIsGenerating(false);
    setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })));
  }, []);

  const addMessage = useCallback(
    (
      role: "user" | "assistant",
      content: string,
      isStreaming = false,
      images?: UploadedImage[],
    ): Message => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        role,
        content,
        images,
        timestamp: new Date(),
        isStreaming,
        mode,
      };
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    [mode],
  );

  const updateStreamingContent = useCallback((id: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content } : msg)),
    );
  }, []);

  const finalizeStreamingMessage = useCallback(
    (id: string, content: string) => {
      const finalMessage: Message = {
        id,
        role: "assistant",
        content,
        timestamp: new Date(),
        isStreaming: false,
        mode,
      };
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? finalMessage : msg)),
      );
      return finalMessage;
    },
    [mode],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    setMessages,
    isGenerating,
    setIsGenerating,
    mode,
    setMode,
    showLoader,
    setShowLoader,
    currentMode,
    stopGeneration,
    addUserMessage: (content: string, images?: UploadedImage[]) =>
      addMessage("user", content, false, images), 
    addStreamingMessage: () => addMessage("assistant", "", true).id,
    updateStreamingContent,
    finalizeStreamingMessage,
    setErrorMessage: (id: string, error: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, content: `Ошибка: ${error}`, isStreaming: false }
            : msg,
        ),
      );
    },
    clearMessages,
    abortControllerRef,
  };
};