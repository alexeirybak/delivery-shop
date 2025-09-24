// Указывает, что это клиентский компонент (для Next.js 13+ App Router)
"use client";

// Импорт необходимых хуков из React
import { useState, useRef, useCallback } from "react";

// Интерфейс для пропсов компонента
interface ImageUploaderProps {
  onImageUploadAction: (file: File) => void; // Колбэк функция, вызываемая после загрузки изображения
  maxSize?: number; // Максимальный размер файла в байтах (по умолчанию 5MB)
}

// Экспорт основного компонента с деструктуризацией пропсов
export default function ImageUploader({
  onImageUploadAction, // Функция обработки загруженного файла
  maxSize = 5 * 1024 * 1024, // Значение по умолчанию: 5MB в байтах
}: ImageUploaderProps) {
  // Состояние для отслеживания процесса перетаскивания файла
  const [isDragging, setIsDragging] = useState(false);
  // Состояние для хранения сообщений об ошибках
  const [error, setError] = useState("");
  // Состояние для отслеживания процесса конвертации изображения
  const [converting, setConverting] = useState(false);
  // Ref для доступа к скрытому input элементу файла
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Функция конвертации изображения в JPEG формат
  const convertToJpeg = useCallback(async (file: File): Promise<File> => {
    // Создание Promise для асинхронной конвертации
    return new Promise((resolve, reject) => {
      // Создание canvas элемента для рисования изображения
      const canvas = document.createElement("canvas");
      // Получение контекста рисования
      const ctx = canvas.getContext("2d");
      // Создание нового изображения
      const img = new Image();

      // Обработчик успешной загрузки изображения
      img.onload = () => {
        // Установка размеров canvas равными размерам изображения
        canvas.width = img.width;
        canvas.height = img.height;

        // Заполняем белым фоном для прозрачных изображений
        if (ctx) {
          ctx.fillStyle = "#FFFFFF"; // Белый цвет фона
          ctx.fillRect(0, 0, canvas.width, canvas.height); // Заливка прямоугольника
          ctx.drawImage(img, 0, 0); // Отрисовка изображения поверх фона
        }

        // Конвертация canvas в blob (бинарные данные)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Создание нового File объекта из blob
              const convertedFile = new File(
                [blob],
                // Замена расширения файла на .jpg
                file.name.replace(/\.[^/.]+$/, ".jpg"),
                { type: "image/jpeg" } // Установка MIME типа
              );
              resolve(convertedFile); // Успешное завершение Promise
            } else {
              reject(new Error("Ошибка конвертации")); // Ошибка конвертации
            }
          },
          "image/jpeg",
          0.9
        ); // Качество 90%
      };

      // Обработчик ошибки загрузки изображения
      img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
      // Установка источника изображения (создание временного URL)
      img.src = URL.createObjectURL(file);
    });
  }, []); // Пустой массив зависимостей - функция создается один раз

  // Функция валидации файла
  const validateFile = useCallback(
    (file: File): boolean => {
      // Массив разрешенных MIME типов
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      // Проверка типа файла
      if (!allowedTypes.includes(file.type)) {
        setError("Разрешены только изображения (JPG, PNG, WebP, GIF)");
        return false;
      }

      // Проверка размера файла
      if (file.size > maxSize) {
        setError(`Файл слишком большой. Максимум ${maxSize / 1024 / 1024}MB`);
        return false;
      }

      // Очистка ошибки при успешной валидации
      setError("");
      return true;
    },
    [maxSize]
  ); // Зависимость от maxSize

  // Основная функция обработки файла
  const handleFile = useCallback(
    async (file: File) => {
      // Валидация файла, выход если невалиден
      if (!validateFile(file)) return;

      // Установка состояния конвертации
      setConverting(true);

      try {
        let finalFile = file;

        // Конвертируем в JPG если это не JPG
        if (!file.type.includes("image/jpeg")) {
          finalFile = await convertToJpeg(file);
        }

        // Вызов колбэка с обработанным файлом
        onImageUploadAction(finalFile);
      } catch (err) {
        // Обработка ошибок конвертации
        setError("Ошибка при обработке изображения");
        console.error("Conversion error:", err);
      } finally {
        // Сброс состояния конвертации в любом случае
        setConverting(false);
      }
    },
    [validateFile, convertToJpeg, onImageUploadAction]
  ); // Зависимости функций

  // Обработчик события drop (бросание файла)
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault(); // Предотвращение стандартного поведения браузера
      setIsDragging(false); // Сброс состояния перетаскивания

      // Преобразование FileList в массив и получение первого файла
      const file = e.dataTransfer.files[0];
      if (file) {
        await handleFile(file);
      }
    },
    [handleFile]
  ); // Зависимость от handleFile

  // Обработчик события dragover (перетаскивание над областью)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Необходимо для разрешения drop
    setIsDragging(true); // Установка состояния перетаскивания
  }, []);

  // Обработчик события dragleave (выход из области перетаскивания)
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false); // Сброс состояния перетаскивания
  }, []);

  // Обработчик выбора файла через input
  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files; // Получение выбранных файлов
      if (files?.[0]) {
        await handleFile(files[0]);
      }
    },
    [handleFile]
  );

  // Функция для программного клика по скрытому input
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click(); // Безопасный вызов click метода
  }, []);

  // Возвращаем JSX разметку компонента
  return (
    <div className="w-full">
      {/* Основная область для drag-and-drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-[#e5ffde]" // Стили при активном перетаскивании
            : "border-gray-300 hover:border-gray-400" // Обычные стили
        } ${converting ? "opacity-50 cursor-not-allowed" : ""}`} // Стили при конвертации
        onDrop={handleDrop} // Обработчик бросания файла
        onDragOver={handleDragOver} // Обработчик перетаскивания над областью
        onDragLeave={handleDragLeave} // Обработчик выхода из области
        onClick={converting ? undefined : triggerFileInput} // Клик только если не конвертируем
      >
        {/* Скрытый input для выбора файла */}
        <input
          ref={fileInputRef} // Привязка ref
          type="file"
          accept="image/*" // Разрешение только изображений
          onChange={handleFileInput} // Обработчик изменения
          className="hidden" // Скрытый элемент
          disabled={converting} // Блокировка во время конвертации
        />

        {/* Содержимое области загрузки */}
        <div className="space-y-2">
          {converting ? (
            // Индикатор загрузки во время конвертации
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          ) : (
            // Иконка загрузки по умолчанию
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}

          {/* Текст инструкции */}
          <p className="text-sm text-gray-600">
            {converting ? (
              "Конвертация в JPG..."
            ) : (
              <>
                Перетащите изображение сюда или{" "}
                <span className="text-primary hover:text-[#008c49] font-medium duration-300">
                  выберите файл
                </span>
              </>
            )}
          </p>

          {/* Дополнительная информация о форматах */}
          <p className="text-xs text-gray-500">
            {converting
              ? "Пожалуйста, подождите"
              : `JPG, PNG, WebP, GIF до ${maxSize / 1024 / 1024}MB`}
          </p>
        </div>
      </div>

      {/* Отображение ошибок */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
