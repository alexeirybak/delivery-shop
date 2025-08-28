export const optimizeImage = async (
  file: File, 
  maxWidth: number = 300, 
  maxHeight: number = 300, 
  quality: number = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url); // Освобождаем память сразу

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      let { width, height } = img;

      // Упрощенное масштабирование с сохранением пропорций
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Генерируем правильное имя файла
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
      URL.revokeObjectURL(url); // Освобождаем память при ошибке
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};