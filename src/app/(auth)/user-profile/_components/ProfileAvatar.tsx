"use client";

import Image from "next/image";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAvatar } from "@/hooks/useAvatar";
import { getAvatarByGender } from "../../../../../utils/getAvatarByGender";

interface AvatarUploadProps {
  gender: string;
}

const ProfileAvatar = ({ gender }: AvatarUploadProps) => {
  const { user, fetchUserData } = useAuthStore();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(""); // Восстанавливаем превью
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { displayAvatar, isLoading: isUploading, uploadAvatar } = useAvatar({
    userId: user?.id,
    gender
  });

  // Эффект для обработки видео потока
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Останавливаем камеру при размонтировании
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      // Очищаем превью URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [cameraStream, previewUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = getAvatarByGender(gender);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Показываем превью перед загрузкой
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const previewUrl = event.target.result as string;
        setPreviewUrl(previewUrl);
        // Сохраняем файл и показываем подтверждение
        setPendingFile(file);
        setShowConfirmModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarConfirm = async () => {
    if (pendingFile) {
      setShowConfirmModal(false);
      try {
        await uploadAvatar(pendingFile);
        // Обновляем данные пользователя
        await fetchUserData();
        // Очищаем превью после успешной загрузки
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl("");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Ошибка загрузки");
        // Восстанавливаем предыдущий аватар в случае ошибки
        setPreviewUrl("");
      } finally {
        setPendingFile(null);
      }
    }
  };

  const handleAvatarCancel = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
    // Очищаем превью
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Функции для работы с камерой
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

  const handleVideoLoaded = () => {
    setIsCameraReady(true);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setIsCameraReady(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        alert("Ошибка создания контекста canvas");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        
        // Устанавливаем превью из фото
        setPreviewUrl(photoDataUrl);
        stopCamera();

        const fileName = user?.id
          ? `avatar-${user.id}-${Date.now()}.jpg`
          : `avatar-${Date.now()}.jpg`;

        const file = dataUrlToFile(photoDataUrl, fileName);
        setPendingFile(file);
        setShowConfirmModal(true);
      } catch (error) {
        console.error("Ошибка создания фото:", error);
        alert("Не удалось сделать фото");
      }
    } else {
      alert("Камера еще не готова. Подождите немного.");
    }
  };

  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  // Получаем отображаемый аватар (либо превью, либо текущий)
  const getDisplayAvatar = () => {
    return previewUrl || displayAvatar;
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <Image
          src={getDisplayAvatar()}
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

        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
          <IconAvatarChange />
        </label>

        <button
          onClick={startCamera}
          disabled={isUploading}
          className="absolute -bottom-1 left-0 bg-[#ff6633] text-white p-2 rounded-full cursor-pointer shadow-article hover:bg-[#e5410a] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Сделать фото"
        >
          <Image
            src="/images/graphics/camera.png"
            alt="Фото"
            width={24}
            height={24}
          />
        </button>
      </div>

      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 rounded">
          <div className="bg-white rounded p-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Сделайте фото
            </h3>

            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedData={handleVideoLoaded}
                className="w-full h-48 bg-gray-200 rounded mb-4 mx-auto"
              />
              {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 w-full">
              <button
                onClick={takePhoto}
                disabled={!isCameraReady || isUploading}
                className="flex-1 text-white px-3 bg-primary hover:bg-[#039b03] hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed duration-300"
              >
                <div className="flex flex-row gap-x-2 justify-center items-center">
                  <Image
                    src="/images/graphics/camera.png"
                    alt="Фото"
                    width={24}
                    height={24}
                  />
                  {isCameraReady ? " Снять фото" : "Загрузка..."}
                </div>
              </button>
              <button
                onClick={stopCamera}
                disabled={isUploading}
                className="flex-1 bg-[#f3f2f1] border-none rounded flex hover:shadow-button-secondary p-2 justify-center items-center active:shadow-(--shadow-button-active) cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
            </div>

            {!isCameraReady && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Камера запускается...
              </p>
            )}
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Подтверждение смены аватара
            </h3>

            <div className="flex justify-center mb-4">
              <Image
                src={previewUrl}
                width={80}
                height={80}
                alt="Превью аватара"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            <p className="text-gray-600 mb-6 text-center">
              Вы уверены, что хотите сменить аватар? Старое изображение будет
              удалено.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleAvatarConfirm}
                disabled={isUploading}
                className="flex-1 bg-primary text-white py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isUploading ? "Загрузка..." : "Да, сменить"}
              </button>
              <button
                onClick={handleAvatarCancel}
                disabled={isUploading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600 mb-1">
          Нажмите на иконки для смены аватара
        </p>
        <p className="text-xs text-gray-500">
          {isUploading ? "Загрузка..." : "Загрузить файл или сделать фото"}
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;