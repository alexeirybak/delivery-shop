import { Image as ImageIcon, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  AspectRatio,
  GenerationStatus,
  StyleType,
  TipTapMenuProps,
} from "../../../../types";
import { formatTime } from "../../../../utils/formatTime";
import { ImageAIModal } from "./ImageAIModal";

export const ImageAIMenu = ({ editor }: TipTapMenuProps) => {
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration] = useState<GenerationStatus>({
    status: "idle",
  });
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>("1:1");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("default");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [apiInfo, setApiInfo] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Таймер для отслеживания времени - ОДИН ЭФФЕКТ!
  useEffect(() => {
    console.log("Timer effect running, status:", generation.status);
    
    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Если статус generating или processing - запускаем таймер
    if (generation.status === "generating" || generation.status === "processing") {
      console.log("Starting timer");
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          console.log("Timer tick, seconds:", prev + 1);
          return prev + 1;
        });
      }, 1000);
    } 
    // Если статус idle - сбрасываем счетчик
    else if (generation.status === "idle") {
      console.log("Resetting timer to 0");
      setElapsedSeconds(0);
    }
    // Для completed и failed оставляем текущее значение
    
    return () => {
      if (timerRef.current) {
        console.log("Cleaning up timer");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [generation.status]);

  // Опрос статуса генерации
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (generation.status === "processing" && generation.operationId) {
      const pollStatus = async () => {
        try {
          console.log("Polling status for operation:", generation.operationId);

          const response = await fetch(
            `/api/yandex-image?operationId=${generation.operationId}`
          );
          const data = await response.json();

          console.log("Polling response:", data);

          if (data.done) {
            // Останавливаем опрос
            if (interval) {
              clearInterval(interval);
              interval = null;
            }

            if (data.imageUrl) {
              setGeneration({
                status: "completed",
                operationId: generation.operationId,
                imageUrl: data.imageUrl,
              });
              console.log("Image generation completed:", data.imageUrl);
            } else if (data.error) {
              setGeneration({
                status: "failed",
                operationId: generation.operationId,
                error: data.error,
              });
              console.error("Image generation failed:", data.error);
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      };

      // Первый запрос сразу
      pollStatus();

      // Затем каждые 3 секунды
      interval = setInterval(pollStatus, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [generation.status, generation.operationId]);

  const closeModal = useCallback(() => {
    // Останавливаем таймеры и интервалы
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    // Таймер уже остановится сам через эффект при смене статуса на idle

    setShowModal(false);
    setPrompt("");
    setGeneration({ status: "idle" }); // Это запустит эффект таймера и сбросит elapsedSeconds
    setApiInfo("");
    // Убираем setElapsedSeconds(0) здесь - это делает эффект
  }, [pollingInterval]);

  // Хэндлеры для управления состоянием
  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  }, []);

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value);
    },
    []
  );

  const handleAspectChange = useCallback((aspect: AspectRatio) => {
    setSelectedAspect(aspect);
  }, []);

  const handleStyleChange = useCallback((style: StyleType) => {
    setSelectedStyle(style);
  }, []);

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      alert("Введите описание изображения");
      return;
    }

    setGeneration({
      status: "generating",
    });
    // Убираем setElapsedSeconds(0) здесь - эффект сам сбросит при смене статуса
    setApiInfo("");

    try {
      console.log("Starting image generation with YandexART:", {
        prompt,
        selectedAspect,
        selectedStyle,
      });

      const response = await fetch("/api/yandex-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: selectedAspect,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      console.log("YandexART response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.details ||
            data.error ||
            `HTTP ${response.status}: Ошибка генерации`
        );
      }

      if (data.operationId) {
        // Переходим в режим опроса статуса - таймер продолжит работать!
        setGeneration({
          status: "processing",
          operationId: data.operationId,
        });

        setApiInfo(
          `Запрос принят YandexART. Operation ID: ${data.operationId.substring(0, 20)}...`
        );
      } else {
        throw new Error("Не получен ID операции от YandexART");
      }
    } catch (err) {
      console.error("YandexART generation error:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setGeneration({
        status: "failed",
        error: errorMsg,
      });

      alert(`Ошибка YandexART: ${errorMsg}`);
    }
  }, [prompt, selectedAspect, selectedStyle]);

  const handleTestAPI = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setGeneration({ status: "generating" });
      setApiInfo("Проверка подключения к YandexART API...");

      const response = await fetch("/api/yandex-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Тестовая генерация: красная панда",
          aspect_ratio: "1:1",
          style: "default",
        }),
      });

      const data = await response.json();
      console.log("YandexART test response:", data);

      if (data.success && data.operationId) {
        setApiInfo(
          `YandexART API работает! Operation ID: ${data.operationId}\n\nМодель: ${data.model || "yandexgpt"}`
        );
        alert(
          `YandexART API подключен!\n\nID операции: ${data.operationId}\n\nМодель: ${data.model || "yandexgpt"}`
        );
      } else {
        setApiInfo(
          `Ошибка YandexART: ${data.details || data.error || "Неизвестная ошибка"}`
        );
        alert(
          `Ошибка YandexART API:\n\n${data.details || data.error || "Неизвестная ошибка"}`
        );
      }
    } catch (err) {
      console.error("YandexART API test error:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setApiInfo(`Ошибка подключения к YandexART: ${errorMsg}`);
      alert(`Ошибка подключения к YandexART:\n\n${errorMsg}`);
    } finally {
      setGeneration({ status: "idle" });
    }
  }, []);

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (!generation.imageUrl) return;
      const link = document.createElement("a");
      link.href = generation.imageUrl;
      link.download = `yandex-art-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [generation.imageUrl]
  );

  const handleInsertToEditor = useCallback(
    (e: React.MouseEvent) => {
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
        closeModal();
      }
    },
    [generation.imageUrl, editor, prompt, closeModal]
  );

  const handleGenerateImage = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await generateImage();
    },
    [generateImage]
  );

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeModal();
    },
    [closeModal]
  );

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleSettingsButtonClick = useCallback(
    (aspect: AspectRatio, e: React.MouseEvent) => {
      e.stopPropagation();
      handleAspectChange(aspect);
    },
    [handleAspectChange]
  );

  const handleStyleButtonClick = useCallback(
    (style: StyleType, e: React.MouseEvent) => {
      e.stopPropagation();
      handleStyleChange(style);
    },
    [handleStyleChange]
  );

  return (
    <>
      {/* Кнопка в тулбаре */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleOpenModal}
          disabled={
            generation.status === "generating" ||
            generation.status === "processing"
          }
          className={`p-2 rounded duration-300 cursor-pointer ${
            generation.status === "generating" ||
            generation.status === "processing"
              ? "bg-blue-100 text-blue-600"
              : showModal
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-200 text-gray-600"
          }`}
          title="Генерация изображений с помощью YandexART"
        >
          {generation.status === "generating" ||
          generation.status === "processing" ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        {(generation.status === "generating" ||
          generation.status === "processing") && (
          <span className="text-xs text-blue-600 animate-pulse">
            {formatTime(elapsedSeconds)}
          </span>
        )}

        {generation.status === "completed" && (
          <span className="text-xs text-green-600">✓</span>
        )}

        {generation.status === "failed" && (
          <span className="text-xs text-red-600">✗</span>
        )}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <ImageAIModal
          prompt={prompt}
          generation={generation}
          selectedAspect={selectedAspect}
          selectedStyle={selectedStyle}
          apiInfo={apiInfo}
          elapsedSeconds={elapsedSeconds}
          editor={editor}
          onPromptChange={handlePromptChange}
          onAspectChange={handleAspectChange}
          onStyleChange={handleStyleChange}
          onTestAPI={handleTestAPI}
          onDownload={handleDownload}
          onInsertToEditor={handleInsertToEditor}
          onGenerateImage={handleGenerateImage}
          onClose={closeModal}
          onModalClick={handleModalClick}
          onCloseClick={handleCloseClick}
          onSettingsButtonClick={handleSettingsButtonClick}
          onStyleButtonClick={handleStyleButtonClick}
        />
      )}
    </>
  );
};