export const optimizeImage = async (
  file: File, 
  size: number = 128, 
  quality: number = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Устанавливаем квадратные размеры
      canvas.width = size;
      canvas.height = size;

      // Вычисляем параметры для обрезки и масштабирования
      const aspectRatio = img.width / img.height;
      
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      // Обрезаем до квадрата перед масштабированием
      if (aspectRatio > 1) {
        // Ширина больше высоты - обрезаем по бокам
        sourceWidth = img.height; // Делаем квадрат
        sourceX = (img.width - sourceWidth) / 2; // Центрируем
      } else if (aspectRatio < 1) {
        // Высота больше ширины - обрезаем сверху и снизу
        sourceHeight = img.width; // Делаем квадрат
        sourceY = (img.height - sourceHeight) / 2; // Центрируем
      }
      // Если aspectRatio = 1 - уже квадрат, ничего не меняем

      // Рисуем с обрезкой и масштабированием
      ctx.drawImage(
        img,
        sourceX,          // X координата источника для обрезки
        sourceY,          // Y координата источника для обрезки
        sourceWidth,      // Ширина области источника
        sourceHeight,     // Высота области источника
        0,                // X координата назначения
        0,                // Y координата назначения
        size,             // Ширина назначения
        size              // Высота назначения
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            resolve(new File([blob], newName, { type: 'image/jpeg' }));
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};