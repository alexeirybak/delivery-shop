import fs from "fs/promises";
import path from "path";

export async function processArticleImages(
  content: string,
  articleId: string,
): Promise<string> {
  // Ищем все временные изображения из контента
  const tempImages = content.match(/\/temp\/temp_[^"']+\.(jpg|jpeg|png|webp)/gi) || [];
  
  if (tempImages.length === 0) return content;

  const tempDir = path.join(process.cwd(), "public", "temp");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "articles", articleId);
  
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Собираем уникальные имена файлов (на случай дублирования ссылок)
    const uniqueTempFiles = [...new Set(tempImages.map(url => url.split('/').pop()!))];
    
    console.log(`Обработка ${uniqueTempFiles.length} временных файлов для статьи ${articleId}:`, uniqueTempFiles);
    
    for (const tempFilename of uniqueTempFiles) {
      const oldPath = path.join(tempDir, tempFilename);
      const permanentFilename = tempFilename.replace('temp_', '');
      const newPath = path.join(uploadsDir, permanentFilename);
      
      try {
        // Проверяем, существует ли временный файл
        try {
          await fs.access(oldPath);
        } catch {
          console.warn(`Временный файл не найден, пропускаем: ${tempFilename}`);
          continue;
        }
        
        // КОПИРУЕМ файл в постоянную папку
        await fs.copyFile(oldPath, newPath);
        
        // УДАЛЯЕМ исходный временный файл
        await fs.unlink(oldPath);
        
        console.log(`Файл перемещен: ${tempFilename} -> ${permanentFilename}`);
        
        // Обновляем ВСЕ ссылки на этот файл в контенте
        const tempUrlPattern = `/temp/${tempFilename}`;
        const permanentUrl = `/uploads/articles/${articleId}/${permanentFilename}`;
        content = content.replace(new RegExp(tempUrlPattern, "gi"), permanentUrl);
        
      } catch (error) {
        console.error(`Ошибка обработки файла ${tempFilename}:`, error);
      }
    }
    
  } catch (error) {
    console.error("Общая ошибка обработки изображений:", error);
  }

  return content;
}