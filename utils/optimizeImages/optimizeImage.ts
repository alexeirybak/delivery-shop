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

      canvas.width = size;
      canvas.height = size;

      const aspectRatio = img.width / img.height;
      
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (aspectRatio > 1) {
        sourceWidth = img.height; 
        sourceX = (img.width - sourceWidth) / 2; 
      } else if (aspectRatio < 1) {
        sourceHeight = img.width; 
        sourceY = (img.height - sourceHeight) / 2; 
      }

      ctx.drawImage(
        img,
        sourceX,          
        sourceY,          
        sourceWidth,      
        sourceHeight,     
        0,                
        0,                
        size,             
        size             
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