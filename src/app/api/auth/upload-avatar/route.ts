import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const db = await getDB();

  try {
    const formData = await request.formData();

    const file = formData.get("avatar") as File;

    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Файл и userId обязательны" },
        { status: 400 }
      );
    }

    const bucket = new GridFSBucket(db, { bucketName: "avatars" });
    const userIdObj = new ObjectId(userId);

    const existingAvatar = await db.collection("avatars.files").findOne({
      "metadata.userId": userIdObj,
    });

    if (existingAvatar) {
      try {
        await bucket.delete(existingAvatar._id);
      } catch (deleteError) {
        console.warn("Не удалось удалить старый аватар:", deleteError);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        userId: userIdObj,
        originalName: file.name,
        uploadedAt: new Date(),
      },
    });

    uploadStream.end(buffer);

    const fileId = await new Promise<ObjectId>((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    return NextResponse.json({
      success: true,
      avatarId: fileId.toString(),
    });
  } catch (error) {
    console.error("Ошибка загрузки аватара:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки аватара" },
      { status: 500 }
    );
  }
}
