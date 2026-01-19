import fs from "fs/promises";
import path from "path";

export async function processArticleImages(
  content: string,
  articleId: string,
): Promise<string> {
  // Ищем временные изображения
  const match = content.match(/\/temp\/([^/]+)\//);
  if (!match) return content; // Нет временных изображений

  const tempArticleId = match[1];
  let updatedContent = content;

  const tempDir = path.join(process.cwd(), "public", "temp", tempArticleId);
  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "articles",
    articleId,
  );

  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    const files = await fs.readdir(tempDir);

    for (const file of files) {
      const oldPath = path.join(tempDir, file);
      const newPath = path.join(uploadsDir, file);

      await fs.rename(oldPath, newPath);

      // Обновляем все ссылки на этот файл
      const tempPattern = `/temp/${tempArticleId}/${file}`;
      const permanentUrl = `/uploads/articles/${articleId}/${file}`;
      updatedContent = updatedContent.replace(
        new RegExp(tempPattern, "g"),
        permanentUrl,
      );
    }

    // Удаляем временную папку
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Ошибка обработки изображений:", error);
  }

  return updatedContent;
}
