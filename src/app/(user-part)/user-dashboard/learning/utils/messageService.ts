import { SendMessageParams, UploadedImage } from "../../types";

interface SendMessageBody {
  prompt: string;
  mode: string;
  type: string;
  stream: boolean;
  generationSettings?: SendMessageParams["generationSettings"];
  images?: UploadedImage[];
}

export const messageService = {
  async processOCR(images: UploadedImage[]): Promise<string> {
    if (images.length === 0) return "";
    return this.processOCRWithModel(images, "page");
  },

  async processHandwrittenOCR(images: UploadedImage[]): Promise<string> {
    if (images.length === 0) return "";
    return this.processOCRWithModel(images, "handwritten");
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

  async sendMessage(
    params: SendMessageParams & { useQwen?: boolean; images?: UploadedImage[] },
  ): Promise<ReadableStreamDefaultReader<Uint8Array> | null> {
    const { prompt, mode, signal, generationSettings, useQwen, images } =
      params;

    const endpoint = useQwen
      ? "/api/gpt/yandex-cloud/qwen3-35b"
      : "/api/gpt/yandex-cloud/deepseek";

    const body: SendMessageBody = {
      prompt,
      mode,
      type: "learning",
      stream: true,
      generationSettings,
    };

    if (images && images.length > 0) {
      body.images = images;
    }


    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error("Ошибка запроса");
    }

    return response.body?.getReader() || null;
  },

  async processStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: (text: string) => void,
  ): Promise<string> {
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              accumulatedText += parsed.text;
              onChunk(accumulatedText);
            }
          } catch (error) {
            console.log("Ошибка парсинга:", error);
          }
        }
      }
    }

    return accumulatedText;
  },
};