import fs from "fs/promises";
import path from "path";

export async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    if (!imagePath?.trim()) return false;

    // Убираем ведущий слеш
    const pathWithoutLeadingSlash = imagePath.startsWith("/") 
      ? imagePath.slice(1) 
      : imagePath;

    // Полный путь к файлу в public
    const fullPath = path.join(process.cwd(), "public", pathWithoutLeadingSlash);

    // Проверяем существование файла
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}