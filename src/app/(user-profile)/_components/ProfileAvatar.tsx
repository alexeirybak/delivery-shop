"use client";

import Image from "next/image";
import { getAvatarByGender } from "../../../../utils/getAvatarByGender";
import { useEffect, useRef, useState } from "react";
import IconAvatarChange from "@/components/svg/IconAvatarChange";
import { useAuthStore } from "@/store/authStore";
import ConfirmAvatarModal from "./ConfirmAvatarModal";
import useAvatar from "@/hooks/useAvatar";
import CameraModal from "./CameraModal";
import { optimizeCameraPhoto } from "../../../../utils/optimizeImages/optimizeCameraPhoto";
import { optimizeImage } from "../../../../utils/optimizeImages/optimizeImage";

const ProfileAvatar = ({ gender }: { gender: string }) => {
  const { user } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
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

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
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

    try {
      const optimizedFile = await optimizeImage(file, 128, 0.7);

      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const previewUrl = event.target.result as string;

          setPreviewUrl(previewUrl);
          setPendingFile(optimizedFile);
          setShowConfirmModal(true);
        }
      };
      reader.readAsDataURL(file);
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

  const handleVideoLoaded = () => {
    setIsCameraReady(true);
  };

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current && isCameraReady && user?.id) {
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
        const optimizedFile = await optimizeCameraPhoto(
          canvas,
          0.7,
          128,
          user.id
        );

        const previewUrl = URL.createObjectURL(optimizedFile);

        setPreviewUrl(previewUrl);
        stopCamera();
        setPendingFile(optimizedFile);
        setShowConfirmModal(true);
      } catch (error) {
        console.error("Ошибка создания фото:", error);
        alert("Не удалось сделать фото");
      }
    } else {
      alert("Камера еще не готова. Подождите немного.");
    }
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
          className="absolute -bottom-1 left-0 bg-[#ff6633] text-white p-2 rounded-full cursor-pointer shadow-article hover:bg-[#e5410a] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Сделать фото"
        >
          <Image
            src="/icons-auth/icon-camera.png"
            alt="Фото"
            width={24}
            height={24}
          />
        </button>
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
          onClose={stopCamera}
          onVideoLoaded={handleVideoLoaded}
          onTakePhoto={takePhoto}
        />
      </div>
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
