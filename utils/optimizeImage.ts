export const optimizeImage = async (
  file: File, 
  maxWidth: number = 300, 
  maxHeight: number = 300, 
  quality: number = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Рассчитываем новые размеры с сохранением пропорций
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Устанавливаем размеры canvas
      canvas.width = width;
      canvas.height = height;

      // Рисуем оптимизированное изображение
      ctx.drawImage(img, 0, 0, width, height);

      // Конвертируем в Blob с выбранным качеством
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File(
              [blob], 
              file.name, 
              { 
                type: 'image/jpeg', 
                lastModified: Date.now() 
              }
            );
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Загружаем изображение
    img.src = URL.createObjectURL(file);
  });
};