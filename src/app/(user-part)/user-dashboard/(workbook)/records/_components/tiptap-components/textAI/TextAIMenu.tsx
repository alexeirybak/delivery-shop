import { Editor } from "@tiptap/react";
import { Brain } from "lucide-react";
import { useState } from "react";
import { TextAIMenuModal } from "./TextAIMenuModal";
import {
  createApiError,
  getErrorMessage,
  getFullErrorMessage,
  isErrorWithStatusCode,
} from "../../../utils/errorUtils";
import { formatAIResponse } from "../../../utils/formatAIResponse";
import { GPTResponse } from "../../../types";
import "../../../styles/text-ai-menu.css";

export const TextAIMenu = ({ editor }: { editor: Editor | null }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAITextModal, setShowAITextModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");

  const getSelectedText = (): string => {
    if (!editor || editor.state.selection.empty) return "";
    return editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " ",
    );
  };

  const selectedText = getSelectedText();

  const generateWithGPT = async (action: string, customPromptText?: string) => {
    if (!editor) return;
    setIsGenerating(true);
    setAiStatus("loading");
    setErrorDetails("");

    try {
      let prompt = "";
      if (customPromptText?.trim()) {
        prompt = customPromptText.trim();
      } else if (selectedText.trim()) {
        prompt = selectedText;
      } else {
        setAiStatus("error");
        setErrorDetails("Выделите текст или введите запрос");
        return;
      }

      let response: Response;
      try {
        response = await fetch("/api/gpt/yandex-cloud/deepseek-workout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, action }),
        });
      } catch (fetchError) {
        const errorMessage =
          fetchError instanceof Error
            ? fetchError.message
            : "Неизвестная сетевая ошибка";
        throw new Error(`Сетевая ошибка: ${errorMessage}`);
      }

      let data: GPTResponse;
      try {
        data = (await response.json()) as GPTResponse;
      } catch (jsonError) {
        const errorMessage =
          jsonError instanceof Error
            ? jsonError.message
            : "Не удалось разобрать ответ";
        throw new Error(`Неверный ответ от сервера: ${errorMessage}`);
      }

      if (!response.ok) {
        throw createApiError(
          data.error || data.details || `HTTP ${response.status}`,
          response.status,
        );
      }

      if (!data.text) {
        throw new Error("Пустой ответ от AI");
      }

      const formattedText = formatAIResponse(data.text);

      if (!editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(formattedText, {
            parseOptions: { preserveWhitespace: "full" },
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent("\n\n" + formattedText + "\n\n", {
            parseOptions: { preserveWhitespace: "full" },
          })
          .run();
      }

      setAiStatus("success");
      setCustomPrompt("");
      setShowAITextModal(false);
      setTimeout(() => setAiStatus("idle"), 2000);
    } catch (error: unknown) {
      setAiStatus("error");

      console.error("AI error:", error);

      if (isErrorWithStatusCode(error)) {
        setErrorDetails(getErrorMessage(error.statusCode));
        if (error.statusCode && error.statusCode >= 500) {
          alert(getFullErrorMessage(error));
        }
      } else if (error instanceof Error) {
        setErrorDetails(error.message);
      } else {
        setErrorDetails("Неизвестная ошибка");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickAction = (actionId: string, customText?: string) => {
    generateWithGPT(actionId, customText);
  };

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      generateWithGPT("custom", customPrompt);
    } else {
      setAiStatus("error");
      setErrorDetails("Введите запрос для AI");
      setTimeout(() => setAiStatus("idle"), 3000);
    }
  };

  const testAPI = async () => {
    try {
      setIsGenerating(true);
      setAiStatus("loading");

      const response = await fetch("/api/gpt/yandex-cloud/deepseek-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            "Привет! Это тестовый запрос. Ответь коротко, работает ли API.",
          action: "custom",
        }),
      });

      const data = (await response.json()) as GPTResponse;

      if (response.ok && data.text) {
        setAiStatus("success");
        alert(`AI работает!\n\nОтвет: ${data.text}`);
      } else {
        throw createApiError(
          data.error || data.details || "Неизвестная ошибка",
          response.status,
        );
      }
    } catch (error: unknown) {
      setAiStatus("error");

      if (isErrorWithStatusCode(error)) {
        alert(getFullErrorMessage(error));
      } else if (error instanceof Error) {
        alert(`Ошибка подключения: ${error.message}`);
      } else {
        alert("Неизвестная ошибка подключения");
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setAiStatus("idle"), 2000);
    }
  };

  if (!editor) return null;

  return (
    <div className="text-ai-menu">
      <button
        type="button"
        onClick={() => setShowAITextModal(true)}
        className="text-ai-trigger"
        title="Открыть AI помощник"
      >
        <Brain />
        <span>ИИ Текст</span>
      </button>
      <TextAIMenuModal
        isOpen={showAITextModal}
        onClose={() => {
          setShowAITextModal(false);
          setAiStatus("idle");
          setErrorDetails("");
        }}
        isGenerating={isGenerating}
        aiStatus={aiStatus}
        selectedText={selectedText}
        customPrompt={customPrompt}
        onCustomPromptChange={setCustomPrompt}
        onCustomPromptAction={handleCustomPrompt}
        onTestAPIAction={testAPI}
        onQuickAction={handleQuickAction}
        errorDetails={errorDetails}
      />
    </div>
  );
};