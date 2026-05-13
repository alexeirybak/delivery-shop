import { useCallback } from "react";
import { messageService } from "../utils/messageService";
import { FileData, GenerationSettings, Message, UploadedImage } from "../../types";
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

      if (
        (!currentInput && currentImages.length === 0 && !customFile) ||
        isGenerating
      )
        return "";

      setShowLoader(true);
      setIsGenerating(true);

      let apiContent = currentInput;

      if (customFile && customFile.text && !customFile.error) {
        const fileContent = `[Файл: ${customFile.name}]\n\n${customFile.text}\n\n---\n\n`;
        apiContent = apiContent ? `${fileContent}${apiContent}` : fileContent;
      }

      if (currentImages.length > 0) {
        const extractedText = await messageService.processOCR(currentImages);

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
        if (mode === "text_to_audio") {
          updateStreamingContent(streamingId, "Создание аудиофайла...");

          const ttsSettings = generationSettings as {
            voiceId?: string;
            speed?: number;
            language?: string;
          };

          const response = await fetch("/api/tts/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: apiContent,
              voice: ttsSettings?.voiceId || "ermil",
              speed: ttsSettings?.speed || 1.0,
              language: ttsSettings?.language || "ru-RU",
            }),
          });

          if (!response.ok) {
            throw new Error("Ошибка создания аудио");
          }

          const data = await response.json();
          
          const finalMessage = finalizeStreamingMessage(streamingId, "Аудиофайл создан");
          finalMessage.audioUrl = data.audioUrl;
          finalMessage.content = "Аудиофайл готов";
          
          const allMessages: Message[] = skipUserMessage
            ? [...messages, finalMessage]
            : [...messages, userMessage!, finalMessage];

          await saveChatToDatabase(allMessages, mode, currentChatId);
          
          setShowLoader(false);
          setIsGenerating(false);
          
          return data.audioUrl;
        }

        let settingsToSend: GenerationSettings | undefined = undefined;

        if (mode === "dictation" || mode === "transcription") {
          settingsToSend = generationSettings;
        }

        abortControllerRef.current = new AbortController();

        const reader = await messageService.sendMessage({
          prompt: apiContent,
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

        const allMessages: Message[] = skipUserMessage
          ? [...messages, finalMessage]
          : [...messages, userMessage!, finalMessage];

        await saveChatToDatabase(allMessages, mode, currentChatId);

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

          const allMessages: Message[] = skipUserMessage
            ? [...messages, finalMessage]
            : [...messages, userMessage!, finalMessage];

          await saveChatToDatabase(allMessages, mode, currentChatId);
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

          const allMessages: Message[] = skipUserMessage
            ? [...messages, errorMessage]
            : [...messages, userMessage!, errorMessage];
            
          await saveChatToDatabase(allMessages, mode, currentChatId);
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