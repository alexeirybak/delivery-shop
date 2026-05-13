import { useCallback } from "react";
import { messageService } from "../utils/messageService";
import { GenerationSettings, Message } from "../../types";
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
      generationSettings?: GenerationSettings,
      forceChatId?: string | null,
      skipUserMessage?: boolean,
      skipDatabaseSave?: boolean,
    ): Promise<{ content: string; chatId: string | null }> => {
      const currentInput = customInput || "";

      if (!currentInput || isGenerating) return { content: "", chatId: null };

      setShowLoader(true);
      setIsGenerating(true);
const userMessage = skipUserMessage ? null : addUserMessage(currentInput);
      const streamingId = addStreamingMessage();

      const chatIdToUse =
        forceChatId !== undefined ? forceChatId : currentChatId;

      try {
        abortControllerRef.current = new AbortController();

        const reader = await messageService.sendMessage({
          prompt: currentInput,
          mode: mode,
          signal: abortControllerRef.current.signal,
          generationSettings: generationSettings,
        });

        if (!reader) {
          throw new Error("Не удалось получить поток данных");
        }

        const decoder = new TextDecoder();
        let accumulatedText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  updateStreamingContent(streamingId, accumulatedText);
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
        }

        const finalMessage = finalizeStreamingMessage(
          streamingId,
          accumulatedText,
        );
        let returnedChatId = chatIdToUse;

        if (!skipDatabaseSave) {
          const newMessages: Message[] = [];
          if (userMessage) newMessages.push(userMessage);
          newMessages.push(finalMessage);

          returnedChatId = await saveChatToDatabase(
            newMessages,
            mode,
            chatIdToUse,
          );
        }

        return { content: accumulatedText, chatId: returnedChatId };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          const currentContent =
            messages.find((m) => m.id === streamingId)?.content || "";
          const stoppedContent = currentContent + "\n\nГенерация остановлена";
          const finalMessage = finalizeStreamingMessage(
            streamingId,
            stoppedContent,
          );

          let returnedChatId = chatIdToUse;

          if (!skipDatabaseSave) {
            const newMessages: Message[] = [];
            if (userMessage) newMessages.push(userMessage);
            newMessages.push(finalMessage);

            returnedChatId = await saveChatToDatabase(
              newMessages,
              mode,
              chatIdToUse,
            );
          }

          return { content: stoppedContent, chatId: returnedChatId };
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

          let returnedChatId = chatIdToUse;

          if (!skipDatabaseSave) {
            const newMessages: Message[] = [];
            if (userMessage) newMessages.push(userMessage);
            newMessages.push(errorMessage);

            returnedChatId = await saveChatToDatabase(
              newMessages,
              mode,
              chatIdToUse,
            );
          }

          return { content: `Ошибка: ${errorMsg}`, chatId: returnedChatId };
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
