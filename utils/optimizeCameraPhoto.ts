// Уменьшение размера - до 10 раз меньше исходного файла
// Стандартизация - все аватары одинакового размера и формата
// Быстрая загрузка - меньший трафик и время загрузки
// Автоматическая обрезка - сохранение пропорций
// Единый формат - все изображения в JPEG для consistency

export const optimizeCameraPhoto = (
  canvas: HTMLCanvasElement,
  quality: number = 0.8,
  maxSize: number = 400,
  userId: string
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    // Получаем исходные размеры
    let width = canvas.width;
    let height = canvas.height;

    // Масштабируем если нужно
    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
    }

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Рисуем с оптимизацией
    ctx.drawImage(canvas, 0, 0, width, height);

    tempCanvas.toBlob(
      (blob) => {
        if (blob) {
          const fileName = `avatar-${userId}-${Date.now()}.jpg`;
          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(file);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/jpeg",
      quality
    );
  });
};
