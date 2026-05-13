import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "ermil", speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Текст обязателен" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json(
        { error: "Yandex Cloud API не настроен" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      text: text,
      lang: "ru-RU",
      voice: voice,
      format: "lpcm",
      sampleRateHertz: "16000",
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS error:", errorText);
      return NextResponse.json(
        { error: `Ошибка синтеза: ${response.status}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    const wavBuffer = convertLpcmToWav(audioBuffer, 16000);
    
    const wavArrayBuffer = new Uint8Array(wavBuffer).buffer;

    return new NextResponse(wavArrayBuffer, {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Ошибка синтеза речи" },
      { status: 500 }
    );
  }
}

function convertLpcmToWav(pcmBuffer: ArrayBuffer, sampleRate: number): Buffer {
  const samples = new Int16Array(pcmBuffer);
  const wavHeader = Buffer.alloc(44);
  
  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(36 + samples.length * 2, 4);
  wavHeader.write("WAVE", 8);
  
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(1, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(sampleRate * 2, 28);
  wavHeader.writeUInt16LE(2, 32);
  wavHeader.writeUInt16LE(16, 34);
  
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(samples.length * 2, 40);
  
  return Buffer.concat([wavHeader, Buffer.from(samples.buffer)]);
}