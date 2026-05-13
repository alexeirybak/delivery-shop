import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as Blob;
    const language = (formData.get("language") as string) || "ru-RU"; 

    if (!audio) {
      return NextResponse.json({ error: "Нет файла" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY!;
    const folderId = process.env.YANDEX_FOLDER_ID!;
    const accessKey = process.env.YANDEX_ACCESS_KEY_ID!;
    const secretKey = process.env.YANDEX_SECRET_ACCESS_KEY!;
    const bucketName = process.env.YANDEX_BUCKET_NAME!;

    const s3 = new S3Client({
      region: "ru-central1",
      endpoint: "https://storage.yandexcloud.net",
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    const fileName = `transcription_${Date.now()}.mp3`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: Buffer.from(await audio.arrayBuffer()),
        ContentType: "audio/mpeg",
      }),
    );

    const fileUrl = `https://storage.yandexcloud.net/${bucketName}/${fileName}`;

    const languageMap: Record<string, string[]> = {
      "ru-RU": ["ru-RU"],
      "en-US": ["en-US"],
      "kk-KZ": ["kk-KZ"],
      "uz-UZ": ["uz-UZ"],
      "de-DE": ["de-DE"],
      "fr-FR": ["fr-FR"],
      "es-ES": ["es-ES"],
      "it-IT": ["it-IT"],
      "tr-TR": ["tr-TR"],
      "zh-CN": ["zh-CN"],
      "ja-JP": ["ja-JP"],
      "ko-KR": ["ko-KR"],
    };

    const recognizeResponse = await fetch(
      "https://stt.api.cloud.yandex.net/stt/v3/recognizeFileAsync",
      {
        method: "POST",
        headers: {
          Authorization: `Api-Key ${apiKey}`,
          "x-folder-id": folderId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uri: fileUrl,
          recognition_model: {
            model: "general",
            language_restriction: {
              restriction_type: "WHITELIST",
              language_code: languageMap[language] || ["ru-RU", "en-US"],
            },
            audio_format: {
              container_audio: {
                container_audio_type: "MP3",
              },
            },
          },
        }),
      },
    );

    if (!recognizeResponse.ok) {
      const err = await recognizeResponse.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const { id: operationId } = await recognizeResponse.json();

    return NextResponse.json({
      operationId,
      fileName,
      bucketName,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка запуска" }, { status: 500 });
  }
}
