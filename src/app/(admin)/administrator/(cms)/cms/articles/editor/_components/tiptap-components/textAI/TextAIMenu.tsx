import { useState } from "react";
import { Brain } from "lucide-react";
import { TextAIMenuModal } from "./TextAIMenuModal";
import {
  createApiError,
  getFullErrorMessage,
  isErrorWithStatusCode,
} from "../../../../utils/errorUtils";
import { Editor } from "@tiptap/react";
import { formatAIResponse } from "../../../../utils/formatAIResponse";

export const TextAIMenu = ({ editor }: { editor: Editor | null }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAITextModal, setShowAITextModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");

  const generateWithYandexGPT = async (
    action: string,
    customPromptText?: string,
  ) => {
    if (!editor) return;

    setIsGenerating(true);
    setAiStatus("loading");
    setErrorDetails("");

    try {
      let selectedText = "";

      if (!editor.state.selection.empty) {
        selectedText = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          " ",
        );
      }

      if (!selectedText.trim() && !customPromptText) {
        alert("Выделите текст для работы с AI или введите запрос");
        setIsGenerating(false);
        setAiStatus("idle");
        return;
      }

      const prompt = customPromptText || selectedText;
      const finalAction = customPromptText ? "custom" : action;

      const response = await fetch(
        "/administrator/cms/api/articles/yandex-gpt",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, action: finalAction }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw createApiError(
          data.error || data.details || `HTTP ${response.status}`,
          response.status,
        );
      }

      if (!data.text) {
        throw new Error("Пустой ответ от YandexGPT");
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

      if (isErrorWithStatusCode(error)) {
        setErrorDetails(error.message);
        alert(getFullErrorMessage(error));
      } else if (error instanceof Error) {
        setErrorDetails(error.message);
        alert(`Ошибка: ${error.message}`);
      } else {
        setErrorDetails("Неизвестная ошибка");
        alert("Произошла неизвестная ошибка");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const testYandexAPI = async () => {
    try {
      setIsGenerating(true);
      setAiStatus("loading");

      const response = await fetch(
        "/administrator/cms/api/articles/yandex-gpt",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt:
              "Привет! Это тестовый запрос. Ответь коротко, работает ли API.",
            action: "custom",
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.text) {
        setAiStatus("success");
        alert(
          `YandexGPT API работает!\n\nОтвет: ${data.text}\n\nМодель: ${data.model || "yandexgpt"}`,
        );
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

  const handleQuickAction = (actionId: string) => {
    generateWithYandexGPT(actionId);
  };

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      generateWithYandexGPT("custom", customPrompt);
    } else {
      alert("Введите запрос для AI");
    }
  };

  if (!editor) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowAITextModal(true)}
        className="px-3 py-1.5 rounded-md bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm shadow-purple-500/20 hover:shadow-md hover:shadow-purple-500/30 cursor-pointer duration-300 flex items-center gap-2 h-8 text-xs"
        title="Открыть AI помощник (YandexGPT)"
      >
        <Brain className="w-3.5 h-3.5" />
        <span>ИИ Текст</span>
      </button>

      <TextAIMenuModal
        isOpen={showAITextModal}
        onClose={() => setShowAITextModal(false)}
        editor={editor}
        onTestAPIAction={testYandexAPI}
        onQuickAction={handleQuickAction}
        onCustomPromptAction={handleCustomPrompt}
        isGenerating={isGenerating}
        aiStatus={aiStatus}
        errorDetails={errorDetails}
        customPrompt={customPrompt}
        onCustomPromptChange={setCustomPrompt}
      />
    </div>
  );
};
