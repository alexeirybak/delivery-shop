import fs from "fs/promises";
import path from "path";

export async function processRecordImages(
  content: string,
  userId: string,
): Promise<string> {
  const tempImages =
    content.match(new RegExp(`/api/uploads/temp/${userId}/temp_[^"']+\\.(jpg|jpeg|png|webp)`, "gi")) || [];

  if (tempImages.length === 0) return content;

  const tempDir = path.join(process.cwd(), "uploads", "temp", userId);
  const recordsDir = path.join(process.cwd(), "uploads", "records", "images", userId);

  await fs.mkdir(recordsDir, { recursive: true });
  await fs.mkdir(tempDir, { recursive: true });

  const uniqueTempFiles = [
    ...new Set(tempImages.map((url) => url.split("/").pop()!)),
  ];

  for (const tempFilename of uniqueTempFiles) {
    const oldPath = path.join(tempDir, tempFilename);
    
    let fileExists = false;
    try {
      await fs.access(oldPath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    if (fileExists) {
      const originalName = tempFilename.replace("temp_", "");
      const fileExtension = path.extname(originalName);
      const baseName = path.parse(originalName).name;
      const shortBaseName = baseName.length > 20 ? baseName.substring(0, 20) : baseName;
      const suffix = Math.random().toString(36).substring(2, 6);
      const permanentFilename = `${shortBaseName}_${suffix}${fileExtension}`;
      const newPath = path.join(recordsDir, permanentFilename);

      await fs.copyFile(oldPath, newPath);
      await fs.unlink(oldPath);

      const tempUrlPattern = `/api/uploads/temp/${userId}/${tempFilename}`;
      const permanentUrl = `/api/uploads/records/images/${userId}/${permanentFilename}`;
      
      content = content.replace(new RegExp(tempUrlPattern, "gi"), permanentUrl);
    } else {
      const files = await fs.readdir(recordsDir).catch(() => []);
      const tempPrefix = tempFilename.replace("temp_", "").split("_")[0];
      const matchingFile = files.find(f => f.startsWith(tempPrefix));
      
      if (matchingFile) {
        const permanentUrl = `/api/uploads/records/images/${userId}/${matchingFile}`;
        const tempUrlPattern = `/api/uploads/temp/${userId}/${tempFilename}`;
        content = content.replace(new RegExp(tempUrlPattern, "gi"), permanentUrl);
      }
    }
  }
  
  return content;
}