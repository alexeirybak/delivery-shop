import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request: NextRequest) {
  try {
    const operationId = request.nextUrl.searchParams.get("operationId");
    const fileName = request.nextUrl.searchParams.get("fileName");

    if (!operationId || !fileName) {
      return NextResponse.json({ error: "Нет operationId" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY!;
    const folderId = process.env.YANDEX_FOLDER_ID!;
    const accessKey = process.env.YANDEX_ACCESS_KEY_ID!;
    const secretKey = process.env.YANDEX_SECRET_ACCESS_KEY!;
    const bucketName = process.env.YANDEX_BUCKET_NAME!;

    const statusResponse = await fetch(
      `https://operation.api.cloud.yandex.net/operations/${operationId}`,
      {
        headers: {
          Authorization: `Api-Key ${apiKey}`,
        },
      },
    );

    const statusData = await statusResponse.json();

    if (!statusData.done) {
      return NextResponse.json({ done: false });
    }

    const resultResponse = await fetch(
      `https://stt.api.cloud.yandex.net/stt/v3/getRecognition?operation_id=${operationId}`,
      {
        headers: {
          Authorization: `Api-Key ${apiKey}`,
          "x-folder-id": folderId,
        },
      },
    );

    const resultText = await resultResponse.text();

    let fullText = "";

    try {
      const json = JSON.parse(resultText);

      if (json.chunks) {
        for (const chunk of json.chunks) {
          const alt = chunk.alternatives?.[0];
          if (alt?.text) {
            fullText += alt.text + " ";
          }
        }
      }
    } catch {
      const lines = resultText.split("\n").filter((l) => l.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);

          if (data.result?.final?.alternatives?.[0]?.text) {
            fullText += data.result.final.alternatives[0].text + " ";
          }

          if (data.result?.alternatives?.[0]?.text) {
            fullText += data.result.alternatives[0].text + " ";
          }

          if (
            data.result?.finalRefinement?.normalizedText?.alternatives?.[0]
              ?.text
          ) {
            fullText +=
              data.result.finalRefinement.normalizedText.alternatives[0].text +
              " ";
          }
        } catch {
        }
      }
    }

    const s3 = new S3Client({
      region: "ru-central1",
      endpoint: "https://storage.yandexcloud.net",
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      }),
    );

    return NextResponse.json({
      done: true,
      text: fullText.trim(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка статуса" }, { status: 500 });
  }
}
