"use client";

import Image from "next/image";
import { getAvatarByGender } from "../../../../../utils/getAvatarByGender";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import { useState, useRef, useEffect } from "react";

interface AvatarUploadProps {
  avatar?: string;
  gender: string;
}

const ProfileAvatar = ({ 
  avatar, 
  gender, 
}: AvatarUploadProps) => {
  const [currentAvatar, setCurrentAvatar] = useState<string>(avatar || "");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDisplayAvatar = () => {
    return currentAvatar || getAvatarByGender(gender);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = getAvatarByGender(gender);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setCurrentAvatar(imageDataUrl);
      alert('Аватар успешно обновлен!');
    };
    reader.readAsDataURL(file);
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
          facingMode: "user"
        } 
      });
      
      setCameraStream(stream);
      setShowCameraModal(true);
      setIsCameraReady(false); // Сбрасываем флаг готовности
      
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      alert('Не удалось получить доступ к камере');
    }
  };

  const handleVideoLoaded = () => {
    setIsCameraReady(true);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setIsCameraReady(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        alert('Ошибка создания контекста canvas');
        return;
      }

      // Устанавливаем размеры
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Делаем снимок
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Конвертируем в DataURL
      try {
        const photoDataUrl = canvas.toDataURL('image/png');
        setCurrentAvatar(photoDataUrl);
        alert('Фото успешно сделано!');
        stopCamera();
      } catch (error) {
        console.error('Ошибка создания фото:', error);
        alert('Не удалось сделать фото');
      }
    } else {
      alert('Камера еще не готова. Подождите немного.');
    }
  };

  // Останавливаем камеру при размонтировании компонента
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
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

        {/* Кнопка загрузки файла */}
        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarChange}
          />
          <IconAvatarChange />
        </label>

        {/* Кнопка для камеры */}
        <button
          onClick={startCamera}
          className="absolute bottom-0 right-8 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-colors"
          title="Сделать фото"
        >
          📸
        </button>
      </div>

      {/* Модальное окно камеры */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Сделайте фото</h3>
            
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={takePhoto}
                disabled={!isCameraReady}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCameraReady ? "📸 Снять фото" : "Загрузка..."}
              </button>
              <button
                onClick={stopCamera}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
        <p className="text-xs text-gray-500">
          Загрузить файл или сделать фото
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;