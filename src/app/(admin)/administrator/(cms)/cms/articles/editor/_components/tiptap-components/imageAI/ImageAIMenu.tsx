import { Image as ImageIcon, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  AspectRatio,
  GenerationStatus,
  StyleType,
  EditorProps,
} from "../../../../types";
import { formatTime } from "../../../../utils/formatTime";
import { ImageAIModal } from "./ImageAIModal";
import { useArticleStore } from "@/store/articleStore";

export const ImageAIMenu = ({ editor }: EditorProps) => {
  const { formData } = useArticleStore();
  console.log(formData.categorySlug);
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

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      generation.status === "generating" ||
      generation.status === "processing"
    ) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          return prev + 1;
        });
      }, 1000);
    } else if (generation.status === "idle") {
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [generation.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (generation.status === "processing" && generation.operationId) {
      const pollStatus = async () => {
        try {
          const response = await fetch(
            `/administrator/cms/api/articles/yandex-image?operationId=${generation.operationId}`
          );
          const data = await response.json();

          if (data.done) {
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

      pollStatus();

      interval = setInterval(pollStatus, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [generation.status, generation.operationId]);

  const closeModal = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    setShowModal(false);
    setPrompt("");
    setGeneration({ status: "idle" });
    setApiInfo("");
  }, [pollingInterval]);

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
    setApiInfo("");

    try {
      const response = await fetch(
        "/administrator/cms/api/articles/yandex-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            aspect_ratio: selectedAspect,
            style: selectedStyle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.details ||
            data.error ||
            `HTTP ${response.status}: Ошибка генерации`
        );
      }

      if (data.operationId) {
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

      const response = await fetch(
        "/administrator/cms/api/articles/yandex-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: "Тестовая генерация: красная панда",
            aspect_ratio: "1:1",
            style: "default",
          }),
        }
      );

      const data = await response.json();
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
              ? "bg-green-100 text-green-600"
              : showModal
                ? "bg-green-100 text-green-600"
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
          <span className="text-xs text-green-600 animate-pulse">
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
