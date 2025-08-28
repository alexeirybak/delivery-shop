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

    // Масштабируем если нужно (сохраняем пропорции)
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Рисуем с оптимизацией (сглаживание для лучшего качества)
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, width, height);

    tempCanvas.toBlob(
      (blob) => {
        if (blob) {
          // Упрощаем создание File (lastModified не обязателен)
          resolve(new File([blob], `avatar-${userId}-${Date.now()}.jpg`, {
            type: "image/jpeg"
          }));
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/jpeg",
      quality
    );
  });
};