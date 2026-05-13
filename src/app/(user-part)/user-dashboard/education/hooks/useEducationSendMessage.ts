import { useCallback } from "react";
import { messageService } from "../utils/messageService";
import {
  GenerationSettings,
  FileData,
  UploadedImage,
  Message,
} from "../../types";
import { MAX_EDUCATION_CONTEXT_MESSAGES } from "../../constants/constants";
import { UseSendMessageParams, UseSendMessageReturn } from "../types";

export const useSendMessage = (
  params: UseSendMessageParams,
): UseSendMessageReturn => {
  const {
    mode,
    messages,
    isGenerating,
    setShowLoader,
    setIsGenerating,
    addUserMessage,
    addStreamingMessage,
    updateStreamingContent,
    finalizeStreamingMessage,
    setErrorMessage,
    saveChatToDatabase,
    currentChatId,
    abortControllerRef,
  } = params;

  const sendMessage = useCallback(
    async (
      customInput?: string,
      customImages?: UploadedImage[],
      generationSettings?: GenerationSettings,
      customFile?: FileData | null,
      skipUserMessage: boolean = false,
    ): Promise<string> => {
      const currentInput = customInput || "";
      const currentImages = customImages || [];
      const isHandwritingMode = mode === "homework_check";

      if (isGenerating) return "";

      setShowLoader(true);
      setIsGenerating(true);

      let apiContent = currentInput;

      if (customFile && customFile.text && !customFile.error) {
        const fileContent = `[Файл: ${customFile.name}]\n\n${customFile.text}\n\n---\n\n`;
        apiContent = apiContent ? `${fileContent}${apiContent}` : fileContent;
      }

      if (currentImages.length > 0) {
        const extractedText = isHandwritingMode
          ? await messageService.processHandwrittenOCR(currentImages)
          : await messageService.processOCR(currentImages);

        if (extractedText) {
          apiContent = apiContent
            ? `${apiContent}\n\nТекст на изображении:\n${extractedText}`
            : `Текст на изображении:\n${extractedText}`;
        }
      }

      let displayContent = currentInput;

      if (customFile && !currentInput) {
        displayContent = `Файл: ${customFile.name}`;
      } else if (customFile && currentInput) {
        displayContent = `Файл: ${customFile.name}\n\n${currentInput}`;
      }

      if (currentImages.length > 0 && !displayContent) {
        displayContent = `Изображение${currentImages.length > 1 ? "я" : ""} (${currentImages.length})`;
      }

      const userMessage = skipUserMessage
        ? null
        : addUserMessage(displayContent, currentImages);

      const streamingId = addStreamingMessage();

      try {
        let finalPrompt = apiContent;
        let settingsToSend: GenerationSettings | undefined = undefined;

        const previousMessages = messages.filter((m) => !m.isStreaming);
        const recentMessages = previousMessages.slice(
          -MAX_EDUCATION_CONTEXT_MESSAGES,
        );

        const modesWithSettings = [
          "syllabus",
          "quiz",
          "credit",
          "lecture",
          "exams",
          "practice",
          "laboratory",
          "interactive",
          "project",
          "homework_check",
          "comparison",
          "debate",
        ];

        if (modesWithSettings.includes(mode) && generationSettings) {
          settingsToSend = generationSettings;
          finalPrompt = apiContent;
        } else if (mode === "chat_education" && recentMessages.length > 0) {
          const historyText = recentMessages
            .map(
              (m) =>
                `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`,
            )
            .join("\n\n");
          finalPrompt = `${historyText}\n\nПользователь: ${apiContent}\n\nАссистент:`;
        }

        abortControllerRef.current = new AbortController();

        const reader = await messageService.sendMessage({
          prompt: finalPrompt,
          mode: mode,
          signal: abortControllerRef.current.signal,
          generationSettings: settingsToSend,
        });

        if (!reader) {
          throw new Error("Не удалось получить поток данных");
        }

        const accumulatedText = await messageService.processStream(
          reader,
          (content: string) => updateStreamingContent(streamingId, content),
        );

        const finalMessage = finalizeStreamingMessage(
          streamingId,
          accumulatedText,
        );

        const newMessages: Message[] = [];
        if (userMessage) newMessages.push(userMessage);
        newMessages.push(finalMessage);

        await saveChatToDatabase(newMessages, mode, currentChatId);

        return accumulatedText;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          const currentContent =
            messages.find((m) => m.id === streamingId)?.content || "";
          const stoppedContent = currentContent + "\n\nГенерация остановлена";
          const finalMessage = finalizeStreamingMessage(
            streamingId,
            stoppedContent,
          );

          const newMessages: Message[] = [];
          if (userMessage) newMessages.push(userMessage);
          newMessages.push(finalMessage);

          await saveChatToDatabase(newMessages, mode, currentChatId);
          return stoppedContent;
        } else {
          console.error("Ошибка:", error);
          const errorMsg =
            error instanceof Error ? error.message : "Неизвестная ошибка";
          setErrorMessage(streamingId, errorMsg);

          const errorMessage: Message = {
            id: streamingId,
            role: "assistant",
            content: `Ошибка: ${errorMsg}`,
            timestamp: new Date(),
            isStreaming: false,
            mode,
          };

          const newMessages: Message[] = [];
          if (userMessage) newMessages.push(userMessage);
          newMessages.push(errorMessage);

          await saveChatToDatabase(newMessages, mode, currentChatId);
          return `Ошибка: ${errorMsg}`;
        }
      } finally {
        setShowLoader(false);
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [
      isGenerating,
      messages,
      mode,
      currentChatId,
      addUserMessage,
      addStreamingMessage,
      updateStreamingContent,
      finalizeStreamingMessage,
      setErrorMessage,
      saveChatToDatabase,
      setShowLoader,
      setIsGenerating,
      abortControllerRef,
    ],
  );

  return { sendMessage };
};
