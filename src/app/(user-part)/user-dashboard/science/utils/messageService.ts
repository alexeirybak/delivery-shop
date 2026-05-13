import { SendMessageParams } from "../../types";

export const messageService = {
  async sendMessage({
    prompt,
    action,
    signal,
    isFullArticle,
    mode,
    settings,
    model = "deepseek",
  }: SendMessageParams): Promise<ReadableStreamDefaultReader<Uint8Array> | null> {
    const endpoint =
      model === "qwen"
        ? "/api/gpt/yandex-cloud/qwen3-235b"
        : "/api/gpt/yandex-cloud/deepseek";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        action, 
        mode,   
        stream: true,
        isFullArticle,
        generationSettings: settings,
      }),
      signal,
    });

    if (!response.ok) {
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

            if (parsed.error) {
              console.error("API Error:", parsed.error);
              throw new Error(parsed.error);
            }

            if (parsed.text) {
              accumulatedText += parsed.text;
              onChunk(accumulatedText);
            }
          } catch (error) {
            console.log("Parse error:", error, "Data:", data);
          }
        }
      }
    }

    return accumulatedText;
  },
};
