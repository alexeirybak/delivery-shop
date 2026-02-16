import {
  ApiResponse,
  ArticleData,
  GenerationRequest,
  ImageGenerationResult,
  ProgressCallback,
} from "../types/auto-generate.types";
import { insertImagesIntoArticle } from "./insertImages";

export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      "/administrator/cms/api/articles/yandex-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt: "Test connection: simple geometric shape",
          aspect_ratio: "1:1",
          style: "photo",
        }),
      },
    );

    if (!response.ok) return false;

    const data: ApiResponse = await response.json();
    return !!data.operationId;
  } catch (error) {
    console.error("API недоступно:", error);
    return false;
  }
};

const pollImageGeneration = async (
  operationId: string,
  maxAttempts = 30,
): Promise<string> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `/administrator/cms/api/articles/yandex-image?operationId=${operationId}`,
      );

      const data: ApiResponse = await response.json();

      if (data.done && data.imageUrl) {
        return data.imageUrl;
      }

      if (data.error) {
        console.error("Ошибка генерации:", data.error);
        throw new Error(data.error);
      }

      // Ждем 3 секунды перед следующей попыткой
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error("Превышено время ожидания генерации");
};

const generateSingleImage = async (
  prompt: string,
  aspectRatio: "16:10" | "1:1" | "21:9",
): Promise<string> => {
  try {
    const requestData: GenerationRequest = {
      prompt,
      aspect_ratio: aspectRatio,
      style: "photo",
    };

    const response = await fetch(
      "/administrator/cms/api/articles/yandex-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.operationId) {
      throw new Error(data.error || "Нет ID операции");
    }

    return await pollImageGeneration(data.operationId);
  } catch (error) {
    console.error(`Ошибка генерации изображения:`, error);
    throw error;
  }
};

export const generateArticleImages = async (
  topic: string,
  articleData: ArticleData,
  onProgress?: ProgressCallback,
): Promise<ImageGenerationResult> => {
  if (!articleData?.content) {
    throw new Error("Отсутствуют данные статьи для генерации изображений");
  }

  const apiAvailable = await testApiConnection();

  if (!apiAvailable) {
    throw new Error("API генерации изображений недоступно");
  }

  try {
    const imgPrompts = {
      main: `Высококачественное профессиональное фото для статьи "${topic}". Редакционный стиль, отличное освещение, резкий фокус, реалистичность, соотношение сторон 16:10.`,
      middle: `Фотореалистичная визуализация для статьи о "${topic}". Концептуальное фото, информативное, детализированное, квадратный формат, профессиональная фотография.`,
      end: `Фотореалистичное заключительное изображение для статьи о "${topic}". Эпичная фотография, широкая панорама, кинематографический формат, эффектная композиция.`,
    };

    // Шаг 1: Основное изображение
    if (onProgress) onProgress(1, "Основное изображение");
    const mainImageUrl = await generateSingleImage(imgPrompts.main, "16:10");

    // Шаг 2: Среднее изображение
    if (onProgress) onProgress(2, "Среднее изображение");
    const middleImageUrl = await generateSingleImage(imgPrompts.middle, "1:1");

    // Шаг 3: Финальное изображение
    if (onProgress) onProgress(3, "Финальное изображение");
    const endImageUrl = await generateSingleImage(imgPrompts.end, "21:9");

    return {
      mainImageUrl,
      middleImageUrl,
      endImageUrl,
    };
  } catch (error) {
    console.error("Ошибка в процессе генерации:", error);
    throw new Error(`Не удалось сгенерировать изображения: ${error instanceof Error ? error.message : 'неизвестная ошибка'}`);
  }
};

// Обновление статьи с изображениями
export const updateArticleWithImages = async (
  articleId: string,
  articleData: ArticleData,
  images: ImageGenerationResult,
  topic: string,
): Promise<boolean> => {
  try {
    // Обновляем контент с изображениями
    const { contentWithImages, imageAlt } = insertImagesIntoArticle(
      articleData.content,
      images,
      topic,
    );

    // Подготовка данных для обновления
    const updateData = {
      ...articleData,
      _id: articleId,
      content: contentWithImages,
      image: images.mainImageUrl,
      imageAlt,
      updatedAt: new Date().toISOString(),
    };

    // Отправляем обновление
    const response = await fetch(`/administrator/cms/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (result.success) {
      return true;
    } else {
      console.error("Ошибка обновления:", result.message);
      return false;
    }
  } catch (error) {
    console.error("Ошибка при обновлении статьи:", error);
    return false;
  }
};