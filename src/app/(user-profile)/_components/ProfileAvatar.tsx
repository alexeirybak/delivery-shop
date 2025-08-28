"use client";

import Image from "next/image";
import { getAvatarByGender } from "../../../../utils/getAvatarByGender";
import { useEffect, useRef, useState } from "react";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import { useAuthStore } from "@/store/authStore";
import ConfirmAvatarModal from "./ConfirmAvatarModal";
import { useAvatar } from "@/hooks/useAvatar";
import CameraModal from "./CameraModal";
import { optimizeCameraPhoto } from "../../../../utils/optimizeCameraPhoto";
import { optimizeImage } from "../../../../utils/optimizeImage";

const ProfileAvatar = ({ gender }: { gender: string }) => {
  const { user } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    displayAvatar,
    isLoading: isUploading,
    uploadAvatar,
  } = useAvatar({ userId: user?.id, gender });

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Останавливаем камеру при размонтировании
  useEffect(() => {
    // Функция очистки - выполнится при размонтировании компонента
    // или при изменении зависимостей перед следующим выполнением эффекта
    return () => {
      // Останавливаем все треки видеопотока камеры
      if (cameraStream) {
        // Получаем все медиа-треки из потока (видео, аудио)
        cameraStream.getTracks().forEach((track) => {
          // Останавливаем каждый трек - камера перестает работать
          track.stop();
        });
      }

      // Освобождаем память от blob URL превью изображения
      if (previewUrl && previewUrl.startsWith("blob:")) {
        // URL.revokeObjectURL освобождает память, занятую blob URL
        // Это предотвращает утечку памяти
        URL.revokeObjectURL(previewUrl);
      }
    };
    // Эффект сработает при размонтировании или при изменении cameraStream/previewUrl
  }, [cameraStream, previewUrl]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = getAvatarByGender(gender);
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // const reader = new FileReader();

    // reader.onload = (event) => {
    //   if (event.target?.result) {
    //     const previewUrl = event.target.result as string;

    //     setPreviewUrl(previewUrl);
    //     setPendingFile(file);
    //     setShowConfirmModal(true);
    //   }
    // };

    // reader.readAsDataURL(file);

    try {
      // Оптимизируем загружаемый файл
      const optimizedFile = await optimizeImage(file, 400, 400, 0.7);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const previewUrl = event.target.result as string;
          setPreviewUrl(previewUrl);
          setPendingFile(optimizedFile);
          setShowConfirmModal(true);
        }
      };
      reader.readAsDataURL(optimizedFile);
    } catch (error) {
      console.error("Ошибка оптимизации изображения:", error);
      alert("Не удалось обработать изображение");
    }
  };

  const handleAvatarConfirm = async () => {
    if (pendingFile) {
      setShowConfirmModal(false);

      try {
        await uploadAvatar(pendingFile);
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl("");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Ошибка загрузки");
        setPreviewUrl("");
      } finally {
        setPendingFile(null);
      }
    }
  };

  const handleAvatarCancel = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      setCameraStream(stream);
      setShowCameraModal(true);
      setIsCameraReady(false);
    } catch (error) {
      console.error("Ошибка доступа к камере:", error);
      alert("Не удалось получить доступ к камере");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setIsCameraReady(false);
  };

  const takePhoto = async () => {
    // Проверяем условия для безопасного создания фото:
    // - videoRef.current - видеоэлемент существует и содержит видеопоток
    // - canvasRef.current - canvas элемент доступен для рисования
    // - isCameraReady - камера полностью инициализирована и готова
    // - user?.id - пользователь авторизован (нужен для имени файла)
    if (videoRef.current && canvasRef.current && isCameraReady && user?.id) {
      // Сохраняем ссылки на DOM-элементы для удобства и производительности
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Получаем 2D контекст рисования для canvas
      // Контекст предоставляет API для работы с графикой
      const context = canvas.getContext("2d");
      // Проверяем, что браузер поддерживает 2D рисование
      if (!context) {
        alert("Ошибка создания контекста canvas");
        return; // Прерываем выполнение если контекст недоступен
      }

      // Устанавливаем размеры canvas равными размерам видео-кадра
      // Это важно для корректного захвата изображения без искажений
      canvas.width = video.videoWidth; // Ширина видео-потока
      canvas.height = video.videoHeight; // Высота видео-потока

      // Рисуем текущий кадр видео на canvas
      // drawImage захватывает текущее изображение с видеоэлемента
      // Параметры: источник, x-координата, y-координата, ширина, высота
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // Оптимизируем фото перед сохранением
        // optimizeCameraPhoto - кастомная функция которая:
        // 1. Конвертирует canvas в Blob/File
        // 2. Сжимает изображение с качеством 0.7 (70%)
        // 3. Масштабирует до 400px (сохраняя пропорции)
        // 4. Генерирует имя файла на основе user.id
        const optimizedFile = await optimizeCameraPhoto(
          canvas, // Canvas элемент с изображением
          0.7, // Качество сжатия (0.7 = 70%)
          400, // Максимальный размер стороны
          user.id // ID пользователя для имени файла
        );

        // Создаем Blob URL для превью изображения
        // URL.createObjectURL создает временную ссылку на файл в памяти
        // Это позволяет отобразить изображение без загрузки на сервер
        const previewUrl = URL.createObjectURL(optimizedFile);

        // Обновляем состояние компонента:
        setPreviewUrl(previewUrl); // URL для превью
        stopCamera(); // Выключаем камеру
        setPendingFile(optimizedFile); // Сохраняем файл для загрузки
        setShowConfirmModal(true); // Показываем модалку подтверждения
      } catch (error) {
        // Обрабатываем ошибки оптимизации или создания файла
        console.error("Ошибка создания фото:", error);
        alert("Не удалось сделать фото");
      }
    } else {
      // Если условия не выполнены - сообщаем пользователю
      alert("Камера еще не готова. Подождите немного.");
    }
  };

  const handleVideoLoaded = () => {
    setIsCameraReady(true);
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <Image
          src={displayAvatar}
          width={128}
          height={128}
          alt="Аватар профиля"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          onError={handleImageError}
          priority
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 duration-300">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileInputChange}
          />
          <IconAvatarChange />
        </label>
        <button
          onClick={startCamera}
          disabled={isUploading}
          className="absolute -bottom-1 left-0 bg-[#c84f26] text-white p-2 rounded-full cursor-pointer shadow-article hover:bg-[#e5410a] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Сделать фото"
        >
          <Image
            src="/images/graphics/camera.png"
            alt="Фото"
            width={24}
            height={24}
          />
        </button>
        {/* Убираем условный рендеринг */}
        <ConfirmAvatarModal
          isOpen={showConfirmModal}
          previewUrl={previewUrl}
          isUploading={isUploading}
          onConfirm={handleAvatarConfirm}
          onCancel={handleAvatarCancel}
        />
        <CameraModal
          isOpen={showCameraModal}
          isCameraReady={isCameraReady}
          isUploading={isUploading}
          videoRef={videoRef}
          canvasRef={canvasRef}
          onTakePhoto={takePhoto}
          onClose={stopCamera}
          onVideoLoaded={handleVideoLoaded}
        />
      </div>
      <div className="mt-3 text-center text-[#414141]">
        <p className="text-sm mb-1">Нажмите на иконки для смены аватара</p>
        <p className="text-xs">
          {isUploading ? "Загрузка..." : "Загрузить файл или сделать фото"}
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
