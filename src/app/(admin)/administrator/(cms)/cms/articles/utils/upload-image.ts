import { Editor } from '@tiptap/react';
import { UploadResult } from '../types';

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

const getInsertPosition = (editor: Editor): number => {

  const { from, to } = editor.state.selection;
  
  if (from !== to) {
    return Math.max(from, to);
  }
  
  return from;
};

export const insertImageToEditor = (
  editor: Editor,
  src: string,
  alt: string,
  title?: string,
) => {
  const insertPos = getInsertPosition(editor);
  
  const imageNode = {
    type: 'image' as const,
    attrs: {
      src,
      alt,
      title: title || alt,
    },
  };

  editor
    .chain()
    .insertContentAt(insertPos, imageNode)
    .focus()
    .run();
  
  setTimeout(() => {
    editor.commands.setTextSelection(insertPos + 1);
  }, 10);
};

export const handleImageUpload = async (
  file: File,
  editor: Editor,
): Promise<void> => {
  const validationError = validateImageFile(file);
  if (validationError) {
    alert(validationError);
    return;
  }

  try {
    const serverResult = await uploadToServer(file);

    insertImageToEditor(
      editor,
      serverResult.url,
      serverResult.originalName,
      serverResult.filename,
    );
  } catch (error) {
    console.error('Upload error:', error);
    alert('Ошибка при загрузке изображения');

    const reader = new FileReader();
    reader.onload = (e) => {
      insertImageToEditor(
        editor,
        e.target?.result as string,
        file.name,
        file.name,
      );
    };
    reader.readAsDataURL(file);
  }
};

export const handleImageUrl = (editor: Editor): void => {
  const url = prompt('Введите URL изображения:', 'https://');

  if (url && editor) {
    if (!url.match(/\.(jpeg|jpg|png|webp)(\?.*)?$/i)) {
      alert('Недопустимый формат файла. Разрешены только JPG, PNG и WebP.');
      return;
    }

    const filename = url.split('/').pop() || 'Изображение';
    insertImageToEditor(editor, url, filename);
  }
};