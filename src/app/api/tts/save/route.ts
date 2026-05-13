import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

const voiceNames: Record<string, string> = {
  alena: "Alena",
  jane: "Jane",
  omazh: "Omazh",
  julia: "Julia",
  filipp: "Filipp",
  ermil: "Ermil",
  madirus: "Madirus",
  zahar: "Zahar",
  john: "John",
  lea: "Lea",
  amira: "Amira",
  madi: "Madi",
  nigora: "Nigora",
};

function generateFileName(text: string, voiceId: string): string {
  const voiceName = voiceNames[voiceId] || voiceId;

  let shortText = text.slice(0, 50).trim();
  shortText = shortText.replace(/[^\w\sа-яА-Яa-zA-Z0-9]/g, "");
  shortText = shortText.replace(/\s+/g, "_");

  return `${voiceName}_${shortText}_${Date.now()}.mp3`;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
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

    if (language === "en-US") finalVoice = "john";
    if (language === "de-DE") finalVoice = "lea";
    if (language === "kk-KK" && !["amira", "madi"].includes(voice))
      finalVoice = "amira";
    if (language === "uz-UZ") finalVoice = "nigora";

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
      console.error("TTS error:", response.status, errorText);
      return NextResponse.json(
        { error: "Ошибка синтеза речи" },
        { status: response.status },
      );
    }

    const audioBuffer = await response.arrayBuffer();

    const userAudioDir = path.join(process.cwd(), "audio", userId);
    if (!fs.existsSync(userAudioDir)) {
      fs.mkdirSync(userAudioDir, { recursive: true });
    }

    const fileName = generateFileName(text, finalVoice);
    const filePath = path.join(userAudioDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(audioBuffer));

    const audioUrl = `/audio/${userId}/${fileName}`;

    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("TTS save error:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка синтеза речи" }, { status: 500 });
  }
}
