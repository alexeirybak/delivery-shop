import { useState, useCallback, useRef } from "react";
import { modes } from "../utils/modesScience";
import { GenerationMode, Message } from "../../types";
import { ScienceMode } from "../types";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<GenerationMode>("chat_science");
  const [showLoader, setShowLoader] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentMode = modes[mode as ScienceMode] || modes["chat_science"];
  
  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setShowLoader(false);
    setIsGenerating(false);
    setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })));
  }, []);

  const addMessage = (
    
    role: "user" | "assistant",
    content: string,
    isStreaming = false,
  ): Message => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      isStreaming,
      mode,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const updateStreamingContent = useCallback((id: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content } : msg)),
    );
  }, []);

  const finalizeStreamingMessage = (id: string, content: string) => {
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
  };

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
    addUserMessage: (content: string) => addMessage("user", content, false),
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
