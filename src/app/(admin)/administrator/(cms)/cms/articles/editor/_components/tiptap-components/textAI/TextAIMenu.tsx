import { Editor } from "@tiptap/react";
import { Brain } from "lucide-react";
import { useState } from "react";
import { TextAIMenuModal } from "./TextAIMenuModal";
import { YandexGPTResponse } from "../../../../types";
import {
  createApiError,
  getErrorMessage,
  getFullErrorMessage,
  isErrorWithStatusCode,
} from "../../../../utils/errorUtils";
import { formatAIResponse } from "../../../../utils/formatAIResponse";

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

  const generateWithYandexGPT = async (
    action: string,
    customPromptText?: string,
  ) => {
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
        response = await fetch("/administrator/cms/api/articles/yandex-gpt", {
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

      let data: YandexGPTResponse;
      try {
        data = (await response.json()) as YandexGPTResponse;
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

      console.error("YandexGPT error:", error);

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

  const handleQuickAction = (actionId: string) => {
    generateWithYandexGPT(actionId);
  };

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      generateWithYandexGPT("custom", customPrompt);
    } else {
      setAiStatus("error");
      setErrorDetails("Введите запрос для AI");
      setTimeout(() => setAiStatus("idle"), 3000);
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

      const data = (await response.json()) as YandexGPTResponse;

      if (response.ok && data.text) {
        setAiStatus("success");
        alert(
          `YandexGPT API работает!\n\nОтвет: ${data.text}\n\nМодель: ${
            data.model || "yandexgpt"
          }`,
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
        onTestAPIAction={testYandexAPI}
        onQuickAction={handleQuickAction}
        errorDetails={errorDetails}
      />
    </div>
  );
};
