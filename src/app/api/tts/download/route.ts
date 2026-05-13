import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      voice = "ermil",
      speed = 1.0,
      language = "ru-RU",
    } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Текст обязателен" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json({ error: "API не настроен" }, { status: 500 });
    }

    const languageMap: Record<string, string> = {
      "ru-RU": "ru-RU",
      "en-US": "en-US",
      "de-DE": "de-DE",
      "kk-KK": "kk-KK",
      "uz-UZ": "uz-UZ",
    };

    const finalLanguage = languageMap[language] || "ru-RU";
    let finalVoice = voice;

    if (language === "en-US") {
      finalVoice = "john";
    }
    if (language === "de-DE") {
      finalVoice = "lea";
    }
    if (language === "kk-KK" && !["amira", "madi"].includes(voice)) {
      finalVoice = "amira";
    }
    if (language === "uz-UZ") {
      finalVoice = "nigora";
    }

    const params = new URLSearchParams({
      text: text,
      lang: finalLanguage,
      voice: finalVoice,
      format: "mp3",
      speed: speed.toString(),
    });

    const response = await fetch(
      `https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize?${params.toString()}`,
      {
        method: "POST",
        headers: {
          Authorization: `Api-Key ${apiKey}`,
          "x-folder-id": folderId,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS v1 error:", response.status, errorText);
      return NextResponse.json(
        { error: "Ошибка синтеза речи" },
        { status: response.status },
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const fileName = `Аудио_${Date.now()}.mp3`;

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("TTS v1 error:", error);
    return NextResponse.json({ error: "Ошибка синтеза речи" }, { status: 500 });
  }
}
