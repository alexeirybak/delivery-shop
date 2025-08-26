import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ error: "Файл и userId обязательны" }, { status: 400 });
    }

    const db = await getDB();
    const bucket = new GridFSBucket(db, { bucketName: 'avatars' });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: { 
        userId: new ObjectId(userId), 
        originalName: file.name, 
        uploadedAt: new Date() 
      }
    });

    uploadStream.end(buffer);

    const fileId = await new Promise<ObjectId>((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { avatar: fileId.toString() } }
    );

    return NextResponse.json({ 
      success: true, 
      avatarId: fileId.toString()
    });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: "Ошибка загрузки аватара" }, { status: 500 });
  }
}