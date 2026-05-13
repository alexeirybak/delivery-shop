import { useCallback } from "react";
import { messageService } from "../utils/messageService";
import {
  GenerationSettings,
  Message,
  FileData,
  UploadedImage,
} from "../../types";
import { visualizationConfigs } from "../utils/visualizationConfig";
import { VISUALIZATION_MODES } from "../utils/visualisationModes";
import { UseSendMessageParams, UseSendMessageReturn, VisualizationMode } from "../types";

const isVisualizationMode = (mode: string): mode is VisualizationMode => {
  return VISUALIZATION_MODES.includes(mode as VisualizationMode);
};

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
    ): Promise<string> => {
      const currentInput = customInput || "";
      const currentImages = customImages || [];

      if (isGenerating) return "";

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

      const userMessage = addUserMessage(displayContent, currentImages);
      const streamingId = addStreamingMessage();

      try {
        let settingsToSend: GenerationSettings | undefined = undefined;

        if (isVisualizationMode(mode) && generationSettings) {
          settingsToSend = generationSettings;
        }

        abortControllerRef.current = new AbortController();

        updateStreamingContent(streamingId, "Генерация...");

        const text = await messageService.sendMessage({
          prompt: apiContent,
          mode: mode,
          signal: abortControllerRef.current.signal,
          generationSettings: settingsToSend,
        });

        let finalMessage: Message;

        const config = visualizationConfigs[mode as keyof typeof visualizationConfigs];

        if (config) {
          try {
            let jsonStr = text;
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
              const parsed = JSON.parse(jsonStr);

              if (config.validate(parsed)) {
                const topicName = currentInput || "данных";
                const shortMessage = config.getShortMessage(parsed, topicName);
                finalMessage = finalizeStreamingMessage(streamingId, shortMessage);
                finalMessage.meta = { type: config.type, jsonData: parsed };
              } else {
                throw new Error(`Неверная структура данных для ${mode}`);
              }
            } else {
              throw new Error("JSON не найден в ответе модели");
            }
          } catch (e) {
            console.error(`Не удалось распарсить ${mode} JSON`, e);
            const errorMessage = `Не удалось создать визуализацию. Попробуйте переформулировать запрос понятнее или нажмите "Попробовать снова".`;
            finalMessage = finalizeStreamingMessage(streamingId, errorMessage);
            finalMessage.meta = { type: config.type, isError: true };
          }
        } else {
          finalMessage = finalizeStreamingMessage(streamingId, text);
        }

        const newMessages: Message[] = [userMessage, finalMessage];
        await saveChatToDatabase(newMessages, mode, currentChatId);

        return text;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          const currentContent = messages.find((m) => m.id === streamingId)?.content || "";
          const stoppedContent = currentContent + "\n\nГенерация остановлена";
          const finalMessage = finalizeStreamingMessage(streamingId, stoppedContent);

          const newMessages: Message[] = [userMessage, finalMessage];
          await saveChatToDatabase(newMessages, mode, currentChatId);
          return stoppedContent;
        } else {
          console.error("Ошибка:", error);
          const friendlyMessage = `Ошибка генерации. Попробуйте ещё раз или переформулируйте вопрос.`;
          setErrorMessage(streamingId, friendlyMessage);

          const errorMessage: Message = {
            id: streamingId,
            role: "assistant",
            content: friendlyMessage,
            timestamp: new Date(),
            isStreaming: false,
            mode,
          };

          const newMessages: Message[] = [userMessage, errorMessage];
          await saveChatToDatabase(newMessages, mode, currentChatId);
          return friendlyMessage;
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