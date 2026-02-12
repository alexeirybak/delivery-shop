import { Editor } from '@tiptap/react';
import { UploadResult } from '../types';

/**
 * Загрузка файла на сервер
 */
export const uploadToServer = async (file: File): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    '/administrator/cms/api/articles/upload/temp-image',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка загрузки: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Неизвестная ошибка');
  }

  return {
    url: data.url,
    filename: data.filename,
    originalName: data.originalName,
  };
};

/**
 * Валидация файла изображения
 */
export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return 'Недопустимый формат файла. Разрешены только JPG, PNG и WebP.';
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return `Файл слишком большой. Максимальный размер: 5MB.`;
  }

  return null;
};

/**
 * Получение позиции для вставки изображения
 */
const getInsertPosition = (editor: Editor, specifiedPosition?: number): number => {
  if (specifiedPosition !== undefined) {
    return specifiedPosition;
  }
  
  // Если позиция не указана, вставляем в конец выделения или текущую позицию курсора
  const { from, to } = editor.state.selection;
  
  // Если есть выделение, вставляем после выделения
  if (from !== to) {
    return Math.max(from, to);
  }
  
  // Если нет выделения, вставляем в текущую позицию курсора
  return from;
};

/**
 * Вставка изображения в редактор
 */
export const insertImageToEditor = (
  editor: Editor,
  src: string,
  alt: string,
  title?: string,
  position?: number
) => {
  const insertPos = getInsertPosition(editor, position);
  
  const imageNode = {
    type: 'image' as const,
    attrs: {
      src,
      alt,
      title: title || alt,
    },
  };

  // Вставляем изображение
  editor
    .chain()
    .insertContentAt(insertPos, imageNode)
    .focus()
    .run();
  
  // Перемещаем курсор после вставленного изображения
  // +1 чтобы курсор был после тега изображения
  setTimeout(() => {
    editor.commands.setTextSelection(insertPos + 1);
  }, 10);
};

/**
 * Обработка файла с загрузкой на сервер и вставкой в редактор
 */
export const handleImageUpload = async (
  file: File,
  editor: Editor,
  position?: number
): Promise<void> => {
  // Валидация
  const validationError = validateImageFile(file);
  if (validationError) {
    alert(validationError);
    return;
  }

  try {
    // Загружаем на сервер
    const serverResult = await uploadToServer(file);

    // Вставляем в редактор
    insertImageToEditor(
      editor,
      serverResult.url,
      serverResult.originalName,
      serverResult.filename,
      position
    );
  } catch (error) {
    console.error('Upload error:', error);
    alert('Ошибка при загрузке изображения');

    // Fallback: base64 preview
    const reader = new FileReader();
    reader.onload = (e) => {
      insertImageToEditor(
        editor,
        e.target?.result as string,
        file.name,
        file.name,
        position
      );
    };
    reader.readAsDataURL(file);
  }
};

/**
 * Обработка URL изображения
 */
export const handleImageUrl = (editor: Editor): void => {
  const url = prompt('Введите URL изображения:', 'https://');

  if (url && editor) {
    if (!url.match(/\.(jpeg|jpg|png|webp)(\?.*)?$/i)) {
      alert('Недопустимый формат файла. Разрешены только JPG, PNG и WebP.');
      return;
    }

    const filename = url.split('/').pop() || 'Изображение';
    insertImageToEditor(editor, url, filename, filename);
  }
};