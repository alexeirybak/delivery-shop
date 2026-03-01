import fs from "fs/promises";
import path from "path";

export async function processArticleImages(
  content: string,
): Promise<string> {
  const tempImages = content.match(/\/temp\/temp_[^"']+\.(jpg|jpeg|png|webp)/gi) || [];
  
  if (tempImages.length === 0) return content;

  const tempDir = path.join(process.cwd(), "uploads", "temp");
  const articlesDir = path.join(process.cwd(), "uploads", "articles");
  
  await fs.mkdir(articlesDir, { recursive: true });
  await fs.mkdir(tempDir, { recursive: true }); 
  
  const uniqueTempFiles = [...new Set(tempImages.map(url => url.split('/').pop()!))];
      
  for (const tempFilename of uniqueTempFiles) {
    const oldPath = path.join(tempDir, tempFilename);
    
    try {
      const originalName = tempFilename.replace('temp_', '');
      const fileExtension = path.extname(originalName);
      const baseName = path.parse(originalName).name;
      
      const shortBaseName = baseName.length > 20 ? baseName.substring(0, 20) : baseName;
      
      const suffix = Math.random().toString(36).substring(2, 6);
      
      const permanentFilename = `${shortBaseName}_${suffix}${fileExtension}`;
      const newPath = path.join(articlesDir, permanentFilename);
      
      await fs.copyFile(oldPath, newPath);
      
      await fs.unlink(oldPath);
      
      const tempUrlPattern = `/temp/${tempFilename}`;
      const permanentUrl = `/api/uploads/articles/${permanentFilename}`;
      content = content.replace(new RegExp(tempUrlPattern, "gi"), permanentUrl);
      
    } catch (error) {
      console.error(`Ошибка с файлом ${tempFilename}:`, error);
    }
  }

  return content;
}