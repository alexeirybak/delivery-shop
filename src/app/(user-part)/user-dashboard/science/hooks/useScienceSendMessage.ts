import { messageService } from "../utils/messageService";
import { ArticleStatus, AIModel, UseSendMessageParams } from "../types";
import { useArticleStatusStore } from "@/store/articleStatusStore";
import { ArticleSettings } from "@/store/scientificArticleSettingsStore";
import { GenerationMode, Message } from "../../types";

const MAX_CONTEXT_MESSAGES = 6; 

export interface SendMessageOptions {
  customInput: string;
  metaType?: "structure" | "article_part";
  isFullArticle?: boolean;
  mode?: GenerationMode;
  settings?: Partial<ArticleSettings>;
  skipAddUserMessage?: boolean;
  model?: AIModel;
  topic?: string;
  existingPlan?: string;
}

export const useSendMessage = (params: UseSendMessageParams) => {
  const {
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

  const { setStatus } = useArticleStatusStore();

  const getActionByType = (
    metaType?: "structure" | "article_part",
    isFullArticle?: boolean,
  ): "structure" | "article_part" => {
    if (isFullArticle) {
      return "article_part";
    }
    if (metaType === "structure") {
      return "structure";
    }
    return "article_part";
  };

  const buildPrompt = (
    currentInput: string,
    metaType?: "structure" | "article_part",
    isFullArticle?: boolean,
    messagesList?: Message[],
    topic?: string,
    existingPlan?: string,
  ): string => {
    if (isFullArticle && metaType === "article_part") {
      if (topic && existingPlan) {
        return `Тема: ${topic}\n\nПлан:\n${existingPlan}\n\nНапиши академическую статью по этой теме, строго следуя плану. Пиши подробно, научным стилем, с обоснованиями и примерами.`;
      }

      if (currentInput === "continue") {
        return "Продолжи писать статью. Продолжай с того места, где остановился. Сохраняй академический стиль и структуру. Не повторяй уже написанное.";
      }

      return currentInput;
    }

    if (metaType === "structure") {
      return currentInput;
    }

    const previousMessages = (messagesList || [])
      .filter((m) => !m.isStreaming)
      .slice(-MAX_CONTEXT_MESSAGES);
      
    if (previousMessages.length > 0) {
      const historyText = previousMessages
        .map(
          (m) =>
            `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`,
        )
        .join("\n\n");
      return `${historyText}\n\nПользователь: ${currentInput}\n\nАссистент:`;
    }

    return currentInput;
  };

  const determineArticleStatus = (
    metaType?: "structure" | "article_part",
    isFullArticle?: boolean,
    isCompleted?: boolean,
    hasError?: boolean,
  ): ArticleStatus => {
    if (hasError) {
      return "idle";
    }

    if (metaType === "structure") {
      return "structure_generated";
    }

    if (metaType === "article_part") {
      if (isCompleted) {
        return "completed";
      }
      if (isFullArticle) {
        return "writing";
      }
      return "writing";
    }

    return "idle";
  };

  const sendMessage = async (options: SendMessageOptions): Promise<void> => {
    const {
      customInput,
      metaType,
      isFullArticle = false,
      mode,
      settings,
      skipAddUserMessage = false,
      model,
      topic,
      existingPlan,
    } = options;

    const currentInput = customInput || "";

    if (!currentInput || isGenerating) return;

    const finalMode = mode || params.mode;

    setShowLoader(true);
    setIsGenerating(true);

    let userMessage: Message | null = null;
    if (!skipAddUserMessage) {
      userMessage = addUserMessage(currentInput);
    }
    const streamingId = addStreamingMessage();

    try {
      const promptWithHistory = buildPrompt(
        currentInput,
        metaType,
        isFullArticle,
        messages,
        topic,
        existingPlan,
      );

      abortControllerRef.current = new AbortController();

      const action = getActionByType(metaType, isFullArticle);

      const reader = await messageService.sendMessage({
        prompt: promptWithHistory,
        action: action,
        signal: abortControllerRef.current.signal,
        isFullArticle,
        mode: finalMode,
        metaType,
        settings,
        model,
      });

      if (!reader) throw new Error("Нет потока");

      const accumulatedText = await messageService.processStream(
        reader,
        (chunk: string) => updateStreamingContent(streamingId, chunk),
      );

      const isCompleted = accumulatedText.includes("[СТАТЬЯ ЗАВЕРШЕНА]");

      let finalContent = accumulatedText;
      if (isCompleted) {
        finalContent = accumulatedText
          .replace(/\[СТАТЬЯ ЗАВЕРШЕНА\]\s*$/, "")
          .trim();
      }

      const finalMessage = finalizeStreamingMessage(streamingId, finalContent);

      if (metaType) {
        finalMessage.meta = { type: metaType };
      }

      const messagesToSave: Message[] = [];
      if (userMessage && !skipAddUserMessage) {
        messagesToSave.push(userMessage);
      }
      messagesToSave.push(finalMessage);

      const articleStatus = determineArticleStatus(
        metaType,
        isFullArticle,
        isCompleted,
        false,
      );

      setStatus(articleStatus);

      await saveChatToDatabase(
        messagesToSave, 
        finalMode,
        currentChatId,
        articleStatus,
      );
    } catch (error) {
      const currentContent =
        messages.find((m) => m.id === streamingId)?.content || "";

      if (error instanceof Error && error.name === "AbortError") {
        if (metaType === "structure") {
          const errorMessage =
            "Генерация плана была прервана. Пожалуйста, начните заново.";
          const errorMessageObj = finalizeStreamingMessage(
            streamingId,
            errorMessage,
          );

          errorMessageObj.meta = {
            type: "structure",
            isError: true,
            isAborted: true,
          };

          const messagesToSave: Message[] = [];
          if (userMessage && !skipAddUserMessage) {
            messagesToSave.push(userMessage);
          }
          messagesToSave.push(errorMessageObj);

          setStatus("idle");
          await saveChatToDatabase(
            messagesToSave,
            finalMode,
            currentChatId,
            "idle",
          );
        } else {
          let finalContent: string;
          let isDraft = false;

          if (currentContent.trim().length > 0) {
            finalContent = currentContent;
            isDraft = true;
          } else {
            finalContent = "Генерация статьи остановлена";
          }

          const finalMessage = finalizeStreamingMessage(
            streamingId,
            finalContent,
          );

          finalMessage.meta = {
            type: "article_part",
            isDraft: isDraft,
          };

          const messagesToSave: Message[] = [];
          if (userMessage && !skipAddUserMessage) {
            messagesToSave.push(userMessage);
          }
          messagesToSave.push(finalMessage);

          await saveChatToDatabase(
            messagesToSave,
            finalMode,
            currentChatId,
            "writing",
          );
        }
      } else {
        const errorMsg = error instanceof Error ? error.message : "Ошибка";

        if (metaType === "structure") {
          const errorMessage = `Ошибка генерации плана: ${errorMsg}. Пожалуйста, начните заново.`;
          finalizeStreamingMessage(streamingId, errorMessage);

          const errorMessageObj = messages.find((m) => m.id === streamingId)!;
          const messagesToSave: Message[] = [];
          if (userMessage && !skipAddUserMessage) {
            messagesToSave.push(userMessage);
          }
          messagesToSave.push(errorMessageObj);

          setStatus("idle");

          await saveChatToDatabase(
            messagesToSave,
            finalMode,
            currentChatId,
            "idle",
          );
        } else {
          let finalContent: string;
          let isDraft = false;

          if (currentContent.trim().length > 0) {
            finalContent = `${currentContent}\n\nОшибка: ${errorMsg}. Генерация прервана.`;
            isDraft = true;
          } else {
            finalContent = `Ошибка: ${errorMsg}`;
          }

          const finalMessage = finalizeStreamingMessage(
            streamingId,
            finalContent,
          );

          finalMessage.meta = {
            type: "article_part",
            isDraft: isDraft,
            hasError: true,
          };

          setErrorMessage(streamingId, errorMsg);

          const messagesToSave: Message[] = [];
          if (userMessage && !skipAddUserMessage) {
            messagesToSave.push(userMessage);
          }
          messagesToSave.push(finalMessage);

          await saveChatToDatabase(
            messagesToSave,
            finalMode,
            currentChatId,
            "writing",
          );
        }
      }
    } finally {
      setShowLoader(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  return { sendMessage };
};