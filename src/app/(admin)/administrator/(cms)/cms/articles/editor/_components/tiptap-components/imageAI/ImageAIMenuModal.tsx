"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Palette,
  AlertCircle,
  X,
  Check,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { PromptInput } from "./PromptInput";
import { SettingsPanel } from "./SettingsPanel";
import { StatusPanel } from "./StatusPanel";
import { ResultPanel } from "./ResultPanel";
import { ErrorPanel } from "./ErrorPanel";
import { GenerationStatus, ImageAIMenuModalProps } from "../../../../types";
import { formatTime } from "../../../../utils/formatTime";

export const ImageAIMenuModal = ({
  isOpen,
  onCloseAction,
  editor,
}: ImageAIMenuModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration] = useState<GenerationStatus>({
    status: "idle",
  });
  const [selectedAspect, setSelectedAspect] = useState<
    "1:1" | "4:3" | "3:4" | "16:9" | "9:16"
  >("1:1");
  const [selectedStyle, setSelectedStyle] = useState<
    "default" | "realistic" | "artistic" | "sketch" | "cartoon"
  >("default");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [apiInfo, setApiInfo] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Таймер для времени генерации
  useEffect(() => {
    if (
      generation.status === "generating" ||
      generation.status === "processing"
    ) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generation.status]);

  // Закрытие по клику вне модалки
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseAction();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseAction();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCloseAction]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert("Введите описание изображения");
      return;
    }

    setGeneration({ status: "generating" });
    setElapsedSeconds(0);
    setApiInfo("");

    try {
      const response = await fetch("/api/yandex-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspect_ratio: selectedAspect,
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || "Ошибка генерации");
      }

      if (data.operationId) {
        setGeneration({
          status: "processing",
          operationId: data.operationId,
        });
        setApiInfo(
          `Запрос принят. ID: ${data.operationId.substring(0, 20)}...`
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setGeneration({ status: "failed", error: errorMsg });
    }
  }, [prompt, selectedAspect, selectedStyle]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!generation.imageUrl) return;
    const link = document.createElement("a");
    link.href = generation.imageUrl;
    link.download = `yandex-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInsertToEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (generation.imageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: generation.imageUrl,
          alt: prompt,
          title: `Сгенерировано YandexART: ${prompt}`,
        })
        .run();
      onCloseAction();
    }
  };

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!generation.imageUrl) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>YandexART Image</title></head>
          <body style="margin:0;padding:20px;background:#f8f9fa;display:flex;justify-content:center;align-items:center;min-height:100vh">
            <img src="${generation.imageUrl}" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2)" />
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onCloseAction();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10000 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onCloseAction();
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={handleModalClick}
        onMouseDown={handleModalClick}
      >
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-red-50 to-yellow-50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Palette className="w-7 h-7 text-red-600" />
              <span>Генератор изображений</span>
              <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                🇷🇺 YandexART
              </span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Российская нейросеть для создания изображений по текстовому
              описанию
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 hover:bg-white rounded-lg ml-2 duration-300 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6">
          {apiInfo && (
            <div className="mb-4 p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800">
              <div className="text-sm whitespace-pre-line">{apiInfo}</div>
            </div>
          )}

          <PromptInput
            prompt={prompt}
            onChange={setPrompt}
            disabled={
              generation.status === "generating" ||
              generation.status === "processing"
            }
          />

          <SettingsPanel
            selectedAspect={selectedAspect}
            selectedStyle={selectedStyle}
            onAspectChange={setSelectedAspect}
            onStyleChange={setSelectedStyle}
            disabled={
              generation.status === "generating" ||
              generation.status === "processing"
            }
          />

          {(generation.status === "generating" ||
            generation.status === "processing") && (
            <StatusPanel
              status={generation.status}
              elapsedSeconds={elapsedSeconds}
              operationId={generation.operationId}
            />
          )}

          {generation.status === "completed" && generation.imageUrl && (
            <ResultPanel
              imageUrl={generation.imageUrl}
              prompt={prompt}
              selectedStyle={selectedStyle}
              selectedAspect={selectedAspect}
              elapsedSeconds={elapsedSeconds}
              onDownload={handleDownload}
              onInsertToEditor={handleInsertToEditor}
              onOpenInNewTab={handleOpenInNewTab}
            />
          )}

          {generation.status === "failed" && generation.error && (
            <ErrorPanel error={generation.error} />
          )}
        </div>

        {/* Футер */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {generation.status === "idle" && "Введите описание для генерации"}
              {generation.status === "generating" && "Запуск YandexART..."}
              {generation.status === "processing" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Прошло: {formatTime(elapsedSeconds)}</span>
                </div>
              )}
              {generation.status === "completed" && (
                <span className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  Готово!
                </span>
              )}
              {generation.status === "failed" && (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Ошибка
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                onMouseDown={(e) => e.stopPropagation()}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium duration-300 cursor-pointer"
              >
                {generation.status === "completed" ? "Закрыть" : "Отмена"}
              </button>

              {generation.status === "completed" ? (
                <button
                  onClick={handleInsertToEditor}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 font-medium flex items-center gap-2 duration-300 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Вставить в документ
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  onMouseDown={(e) => e.stopPropagation()}
                  disabled={
                    generation.status === "generating" ||
                    generation.status === "processing" ||
                    !prompt.trim()
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 duration-300 cursor-pointer"
                >
                  {generation.status === "generating" ||
                  generation.status === "processing" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Создать изображение
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};