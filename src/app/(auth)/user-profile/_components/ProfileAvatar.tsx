"use client";

import Image from "next/image";
import { getAvatarByGender } from "../../../../../utils/getAvatarByGender";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

interface AvatarUploadProps {
  avatar?: string;
  gender: string;
}

const ProfileAvatar = ({ avatar, gender }: AvatarUploadProps) => {
  const { user } = useAuthStore();
  const [currentAvatar, setCurrentAvatar] = useState<string>(avatar || "");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDisplayAvatar = () => {
    // Если currentAvatar уже DataURL (начинается с data:image), используем его
    if (currentAvatar.startsWith("data:image")) {
      return currentAvatar;
    } else if (currentAvatar) {
      return `/api/auth/avatar/${currentAvatar}`;
    }
    return getAvatarByGender(gender);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = getAvatarByGender(gender);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleAvatarChange(file);
  };

  const handleAvatarChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      if (!user?.id) {
        alert("Ошибка: пользователь не авторизован");
        return;
      }

      formData.append("userId", user.id);

      const response = await fetch("/api/auth/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentAvatar(result.avatarId);
        alert("Аватар успешно обновлен!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка загрузки");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Не удалось загрузить аватар");
    }
  };

  // Эффект для обработки видео потока
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

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
        const photoDataUrl = canvas.toDataURL("image/png");
        // Для фото с камеры временно используем DataURL
        setCurrentAvatar(photoDataUrl);
        alert("Фото успешно сделано!");
        stopCamera();

        // Конвертируем и загружаем на сервер
        const file = dataUrlToFile(photoDataUrl, "camera-photo.png");
        handleAvatarChange(file);
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
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

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

        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileInputChange}
          />
          <IconAvatarChange />
        </label>

        <button
          onClick={startCamera}
          className="absolute -bottom-1 left-0 bg-[#ff6633] text-white p-2 rounded-full cursor-pointer shadow-article hover:bg-[#e5410a] duration-300"
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
                disabled={!isCameraReady}
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
                className="flex-1 bg-[#f3f2f1] border-none rounded flex hover:shadow-button-secondary p-2 justify-center items-center active:shadow-(--shadow-button-active) cursor-pointer duration-300"
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

      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600 mb-1">
          Нажмите на иконки для смены аватара
        </p>
        <p className="text-xs text-gray-500">Загрузить файл или сделать фото</p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
