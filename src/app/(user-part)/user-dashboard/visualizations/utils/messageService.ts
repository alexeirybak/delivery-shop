import { GenerationSettings, UploadedImage } from "../../types";

export const messageService = {
  async processOCR(images: UploadedImage[]): Promise<string> {
    if (images.length === 0) return "";
    return this.processOCRWithModel(images, "page");
  },

  async processOCRWithModel(
    images: UploadedImage[],
    model: "page" | "handwritten",
  ): Promise<string> {
    try {
      const endpoint =
        model === "handwritten"
          ? "/api/gpt/yandex-cloud/ocr-handwritten"
          : "/api/gpt/yandex-cloud/ocr";

      const ocrResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      if (ocrResponse.ok) {
        const ocrResult = await ocrResponse.json();
        return ocrResult.text;
      }
    } catch (error) {
      console.error(`OCR (${model}) не выполнен:`, error);
    }
    return "";
  },

  async sendMessage(params: {
    prompt: string;
    mode: string;
    generationSettings?: GenerationSettings;
    signal?: AbortSignal;
  }): Promise<string> {
    const { prompt, mode, generationSettings, signal } = params;

    const response = await fetch("/api/gpt/yandex-cloud/yandex-pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        mode,
        stream: false,
        generationSettings,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  },
};
