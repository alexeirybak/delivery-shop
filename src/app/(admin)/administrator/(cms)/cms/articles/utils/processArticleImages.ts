import fs from "fs/promises";
import path from "path";

export async function processArticleImages(
  content: string,
): Promise<string> {
  const tempImages = content.match(/\/temp\/temp_[^"']+\.(jpg|jpeg|png|webp)/gi) || [];
  
  if (tempImages.length === 0) return content;

  const tempDir = path.join(process.cwd(), "public", "temp");
  const articlesDir = path.join(process.cwd(), "public", "uploads", "articles");
  
  await fs.mkdir(articlesDir, { recursive: true });
  
  const uniqueTempFiles = [...new Set(tempImages.map(url => url.split('/').pop()!))];
      
  for (const tempFilename of uniqueTempFiles) {
    const oldPath = path.join(tempDir, tempFilename);
    
    try {
      const originalName = tempFilename.replace('temp_', '');
      const fileExtension = path.extname(originalName);
      const baseName = path.parse(originalName).name;
      
      // Ограничиваем длину имени (макс 20 символов)
      const shortBaseName = baseName.length > 20 ? baseName.substring(0, 20) : baseName;
      
      // Добавляем короткий уникальный суффикс (4 символа)
      const suffix = Math.random().toString(36).substring(2, 6);
      
      // Формат: короткое_имя_суффикс.расширение
      const permanentFilename = `${shortBaseName}_${suffix}${fileExtension}`;
      const newPath = path.join(articlesDir, permanentFilename);
      
      // Копируем файл
      await fs.copyFile(oldPath, newPath);
      
      // Удаляем временный файл
      await fs.unlink(oldPath);
      
      // Обновляем ссылки
      const tempUrlPattern = `/temp/${tempFilename}`;
      const permanentUrl = `/uploads/articles/${permanentFilename}`;
      content = content.replace(new RegExp(tempUrlPattern, "gi"), permanentUrl);
      
    } catch (error) {
      console.error(`Ошибка с файлом ${tempFilename}:`, error);
    }
  }

  return content;
}