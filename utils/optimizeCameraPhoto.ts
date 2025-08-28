// Экспорт функции для оптимизации фото с камеры
// Возвращает Promise, который резолвится File объектом
export const optimizeCameraPhoto = (
  canvas: HTMLCanvasElement,    // Исходный canvas с изображением
  quality: number = 0.8,        // Качество сжатия JPEG (0-1), по умолчанию 80%
  maxSize: number = 400,        // Максимальный размер стороны в пикселях
  userId: string                // ID пользователя для генерации имени файла
): Promise<File> => {
  // Создаем и возвращаем Promise для асинхронной обработки
  return new Promise((resolve, reject) => {
    // Создаем временный canvas элемент для операций ресайза
    // Это предотвращает изменение исходного canvas
    const tempCanvas = document.createElement("canvas");
    
    // Получаем 2D контекст рисования для временного canvas
    const ctx = tempCanvas.getContext("2d");

    // Проверяем, что браузер поддерживает 2D canvas
    if (!ctx) {
      // Если контекст недоступен - реджектим Promise с ошибкой
      reject(new Error("Canvas context not available"));
      return; // Прерываем выполнение
    }

    // Сохраняем исходные размеры изображения
    let width = canvas.width;
    let height = canvas.height;

    // Проверяем, нужно ли масштабирование
    if (width > maxSize || height > maxSize) {
      // Вычисляем коэффициент масштабирования, сохраняя пропорции
      // Math.min ensures the image fits within maxSize while maintaining aspect ratio
      const ratio = Math.min(maxSize / width, maxSize / height);
      
      // Вычисляем новые размеры с округлением до целых пикселей
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Устанавливаем вычисленные размеры для временного canvas
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Настраиваем высокое качество сглаживания при масштабировании
    ctx.imageSmoothingQuality = 'high';
    
    // Копируем и масштабируем изображение из исходного canvas во временный
    // drawImage выполняет ресайз с учетом настроек сглаживания
    ctx.drawImage(canvas, 0, 0, width, height);

    // Конвертируем canvas в Blob (бинарные данные изображения)
    tempCanvas.toBlob(
      // Колбэк, вызываемый когда Blob готов
      (blob) => {
        if (blob) {
          // Создаем File объект из Blob с уникальным именем
          resolve(new File([blob], `avatar-${userId}-${Date.now()}.jpg`, {
            type: "image/jpeg" // Явно указываем MIME-тип
          }));
        } else {
          // Если Blob создать не удалось (редкий случай)
          reject(new Error("Failed to create blob"));
        }
      },
      "image/jpeg", // Формат выходного изображения
      quality        // Качество сжатия (0.8 = 80%)
    );
  });
};