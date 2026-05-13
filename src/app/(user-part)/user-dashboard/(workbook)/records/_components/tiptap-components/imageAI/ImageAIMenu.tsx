import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageAIMenuModal } from "./ImageAIMenuModal";
import {
  ApiResponse,
  AspectRatio,
  EditorProps,
  GenerationRequest,
  GenerationStatus,
  StyleType,
} from "../../../types";
import "../../../styles/image-ai-menu.css";

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

  useEffect(() => {
    if (generation.status !== "loading" || !generation.operationId) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const pollStatus = async () => {
      if (!isMounted) return;
      try {
        const response = await fetch(
          `/api/gpt/yandex-cloud/yandex-image?operationId=${generation.operationId}`,
        );
        const data: ApiResponse = await response.json();

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

    pollStatus();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [generation.status, generation.operationId]);

  const callAPI = useCallback(
    async (requestData: GenerationRequest): Promise<ApiResponse> => {
      const response = await fetch("/api/gpt/yandex-cloud/yandex-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      return await response.json();
    },
    [],
  );

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      alert("Введите описание изображения");
      return;
    }

    setGeneration({ status: "generating" });
    setApiInfo("");

    try {
      const data = await callAPI({
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
      alert(`Ошибка AI: ${errorMsg}`);
    }
  }, [prompt, selectedAspect, selectedStyle, callAPI]);

  const handleTestAPI = useCallback(async () => {
    setApiInfo("Проверка подключения...");

    try {
      const data = await callAPI({
        prompt: "Тестовая генерация: красная панда",
        aspect_ratio: "1:1",
        style: "default",
      });

      if (data.success && data.operationId) {
        setApiInfo(
          "AI работает!",
        );
        alert(
          "AI подключен! Чем могу помочь?",
        );
      } else {
        setApiInfo(
          `Ошибка: ${data.details || data.error || "Неизвестная ошибка"}`,
        );
        alert(
          `Ошибка AI: ${data.details || data.error || "Неизвестная ошибка"}`,
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setApiInfo(`Ошибка подключения: ${errorMsg}`);
      alert(`Ошибка подключения: ${errorMsg}`);
    }
  }, [callAPI]);

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

  const handleCloseClick = () => {
    closeModal();
  };

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
          title: `Сгенерировано AI: ${prompt}`,
        })
        .run();
      closeModal();
    }
  }, [generation.imageUrl, editor, prompt, closeModal]);

  const handleGenerateImage = useCallback(async () => {
    await generateImage();
  }, [generateImage]);

  return (
    <div className="image-ai-menu" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setShowAIImageModal(true)}
        className="image-ai-trigger"
        title="Сгенерировать изображение с помощью ИИ"
      >
        <ImageIcon />
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
        onCloseClick={handleCloseClick}
        onAspectChange={handleAspectChange}
        onStyleChange={handleStyleChange}
        onPromptChange={handlePromptChange}
        onDownload={handleDownload}
        onInsertToEditor={handleInsertToEditor}
        onGenerateImage={handleGenerateImage}
        onTestAPI={handleTestAPI}
      />
    </div>
  );
};