"use client";

import { useState } from "react";
import { Brain, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { Editor } from "@tiptap/react";

import { AIMenuModal } from "./AIMenuModal";
import { AIStatus, ApiResponse } from "../../../../types";
import {
  createApiError,
  getFullErrorMessage,
  isErrorWithStatusCode,
} from "../../../../utils/errorUtils";

interface TipTapMenuProps {
  editor: Editor | null;
}

export const AIMenu = ({ editor }: TipTapMenuProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");

  const generateWithYandexGPT = async (
    action: string,
    customPromptText?: string
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
          " "
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
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw createApiError(
          data.error || data.details || `HTTP ${response.status}`,
          response.status
        );
      }

      if (!data.text) {
        throw new Error("Пустой ответ от YandexGPT");
      }

      // Вставляем результат
      if (!editor.state.selection.empty) {
        editor.chain().focus().deleteSelection().insertContent(data.text).run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent("\n\n" + data.text + "\n\n")
          .run();
      }

      setAiStatus("success");
      setCustomPrompt("");
      setShowAIModal(false);
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
        }
      );

      const data: ApiResponse = await response.json();

      if (response.ok && data.text) {
        setAiStatus("success");
        alert(
          `YandexGPT API работает!\n\nОтвет: ${data.text}\n\nМодель: ${data.model || "yandexgpt"}`
        );
      } else {
        throw createApiError(
          data.error || data.details || "Неизвестная ошибка",
          response.status
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
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">AI:</span>
        <button
          type="button"
          onClick={() => setShowAIModal(true)}
          disabled={isGenerating}
          className={`p-2 rounded duration-300 cursor-pointer ${
            isGenerating
              ? "bg-green-100 text-green-600"
              : showAIModal
                ? "bg-green-100 text-green-600"
                : "hover:bg-gray-200 text-gray-600"
          }`}
          title="Открыть AI помощник (YandexGPT)"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
        </button>

        {aiStatus === "loading" && (
          <span className="text-xs text-green-600 animate-pulse">
            YandexGPT...
          </span>
        )}
        {aiStatus === "success" && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>Готово</span>
          </div>
        )}
        {aiStatus === "error" && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <XCircle className="w-3 h-3" />
            <span>Ошибка</span>
          </div>
        )}
      </div>

      <AIMenuModal
        isOpen={showAIModal}
        onCloseAction={() => setShowAIModal(false)}
        editor={editor}
        onTestAPIAction={testYandexAPI}
        onQuickAction={handleQuickAction}
        onCustomPromptAction={handleCustomPrompt}
        isGenerating={isGenerating}
        aiStatus={aiStatus}
        errorDetails={errorDetails}
        customPrompt={customPrompt}
        onCustomPromptChangeAction={setCustomPrompt}
      />
    </div>
  );
};
