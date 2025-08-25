"use client";

import Image from "next/image";
import { getAvatarByGender } from "../../../../../utils/getAvatarByGender";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import { useState, useRef } from "react";

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
    };
    reader.readAsDataURL(file);
  };

  // Функции для работы с камерой
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user" // Фронтальная камера
        } 
      });
      
      setCameraStream(stream);
      setShowCameraModal(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      alert('Не удалось получить доступ к камере. Проверьте разрешения.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const photoDataUrl = canvas.toDataURL('image/png');
      setCurrentAvatar(photoDataUrl);
      stopCamera();
    }
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

        {/* Простая кнопка без выпадающего меню */}
        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarChange}
          />
          <IconAvatarChange />
        </label>

        {/* Кнопка для камеры - можно добавить рядом */}
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
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 bg-gray-200 rounded mb-4 mx-auto"
            />
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={takePhoto}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Снять фото
              </button>
              <button
                onClick={stopCamera}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
          Загрузить файл или сделать фото
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;