import { Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  AspectRatio,
  GenerationStatus,
  StyleType,
  EditorProps,
  GenerationRequest,
  ApiResponse,
} from "../../../../types";
import { ImageAIMenuModal } from "./ImageAIMenuModal";

export const ImageAIMenu = ({ editor }: EditorProps) => {
  const [showAIImageModal, setShowAIImageModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration] = useState<GenerationStatus>({
    status: "idle",
  });
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>("1:1");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("default");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [apiInfo, setApiInfo] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Таймер
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (generation.status === "generating" || generation.status === "loading") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (generation.status === "idle") {
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generation.status]);

  // Опрос статуса
useEffect(() => {
  if (generation.status !== "loading" || !generation.operationId) return;

  let timeoutId: NodeJS.Timeout | null = null;
  let isMounted = true;

  const pollStatus = async () => {
    if (!isMounted) return;
    
    try {
      console.log("Polling status for:", generation.operationId);
      const response = await fetch(
        `/administrator/cms/api/articles/yandex-image?operationId=${generation.operationId}`,
      );
      const data: ApiResponse = await response.json();
      
      console.log("Polling response:", data.done, data.status);

      if (data.done) {
        if (data.imageUrl) {
          setGeneration({
            status: "success",
            operationId: generation.operationId,
            imageUrl: data.imageUrl,
          });
        } else if (data.error) {
          setGeneration({
            status: "error",
            operationId: generation.operationId,
            error: data.error,
          });
        }
      } else {
        // Если еще не готово, опрашиваем снова через 3 секунды
        if (isMounted) {
          timeoutId = setTimeout(pollStatus, 3000);
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
      if (isMounted) {
        setGeneration({
          status: "error",
          operationId: generation.operationId,
          error: "Ошибка при опросе статуса",
        });
      }
    }
  };

  // Начинаем первый опрос
  pollStatus();

  return () => {
    isMounted = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [generation.status, generation.operationId]);

  // Базовые функции
  const closeModal = useCallback(() => {
    setShowAIImageModal(false);
    setPrompt("");
    setGeneration({ status: "idle" });
    setApiInfo("");
    setElapsedSeconds(0);
  }, []);

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value),
    [],
  );

  const handleAspectChange = useCallback(
    (aspect: AspectRatio) => setSelectedAspect(aspect),
    [],
  );

  const handleStyleChange = useCallback(
    (style: StyleType) => setSelectedStyle(style),
    [],
  );

  // API функция с типами
  const callYandexAPI = useCallback(
    async (requestData: GenerationRequest): Promise<ApiResponse> => {
      const response = await fetch(
        "/administrator/cms/api/articles/yandex-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        },
      );
      return await response.json();
    },
    [],
  );

  // Генерация изображения
  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      alert("Введите описание изображения");
      return;
    }

    setGeneration({ status: "generating" });
    setApiInfo("");

    try {
      const data = await callYandexAPI({
        prompt,
        aspect_ratio: selectedAspect,
        style: selectedStyle,
      });

      if (!data.success) {
        throw new Error(data.details || data.error || "Ошибка генерации");
      }

      if (data.operationId) {
        setGeneration({
          status: "loading",
          operationId: data.operationId,
        });
        setApiInfo(
          `Запрос принят. ID: ${data.operationId.substring(0, 20)}...`,
        );
      } else {
        throw new Error("Не получен ID операции");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setGeneration({ status: "error", error: errorMsg });
      alert(`Ошибка YandexART: ${errorMsg}`);
    }
  }, [prompt, selectedAspect, selectedStyle, callYandexAPI]);

  // Тест API
  const handleTestAPI = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setApiInfo("Проверка подключения...");

      try {
        const data = await callYandexAPI({
          prompt: "Тестовая генерация: красная панда",
          aspect_ratio: "1:1",
          style: "default",
        });

        if (data.success && data.operationId) {
          setApiInfo(
            `API работает! ID: ${data.operationId}\nМодель: ${data.model || "yandexgpt"}`,
          );
          alert(
            `API подключен!\nID: ${data.operationId}\nМодель: ${data.model || "yandexgpt"}`,
          );
        } else {
          setApiInfo(
            `Ошибка: ${data.details || data.error || "Неизвестная ошибка"}`,
          );
          alert(
            `Ошибка API: ${data.details || data.error || "Неизвестная ошибка"}`,
          );
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Неизвестная ошибка";
        setApiInfo(`Ошибка подключения: ${errorMsg}`);
        alert(`Ошибка подключения: ${errorMsg}`);
      }
    },
    [callYandexAPI],
  );

  // Обработчики событий
  const handleDownload = useCallback(() => {
    if (!generation.imageUrl) return;
    const link = document.createElement("a");
    link.href = generation.imageUrl;
    link.download = `yandex-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generation.imageUrl]);

  const handleInsertToEditor = useCallback(() => {
    if (generation.imageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: generation.imageUrl,
          alt: prompt,
          title: `${prompt}`,
        })
        .run();
      closeModal();
    }
  }, [generation.imageUrl, editor, prompt, closeModal]);

  const handleGenerateImage = useCallback(async () => {
    await generateImage();
  }, [generateImage]);

  const handleCloseClick = useCallback(() => closeModal(), [closeModal]);

  const handleSettingsButtonClick = useCallback((aspect: AspectRatio) => {
    setSelectedAspect(aspect);
  }, []);

  const handleStyleButtonClick = useCallback((style: StyleType) => {
    setSelectedStyle(style);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowAIImageModal(true)}
        className="px-3 py-1.5 rounded-md bg-linear-to-r from-cyan-500 to-blue-700 hover:from-cyan-600 hover:to-blue-800 text-white shadow-sm shadow-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/30 cursor-pointer duration-200 flex items-center gap-2 min-w-[85px] h-8 text-xs"
        title="Сгенерировать изображение с помощью ИИ"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span>ИИ Изо</span>
      </button>

      <ImageAIMenuModal
        isOpen={showAIImageModal}
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
        onCloseClick={handleCloseClick}
        onSettingsButtonClick={handleSettingsButtonClick}
        onStyleButtonClick={handleStyleButtonClick}
      />
    </div>
  );
};
