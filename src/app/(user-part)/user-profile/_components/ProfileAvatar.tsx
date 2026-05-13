"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconAvatarChange from "./IconAvatarChange";
import { useAuthStore } from "@/store/authStore";
import ConfirmAvatarModal from "./ConfirmAvatarModal";
import useAvatar from "../hooks/useAvatar";
import CameraModal from "./CameraModal";
import { optimizeCameraPhoto } from "../utils/optimizeCameraPhoto";
import { optimizeImage } from "../utils/optimizeImage";
import { Camera, User } from "lucide-react";
import "../styles/profile-avatar.css";

const ProfileAvatar = () => {
  const { user } = useAuthStore();
  const [imageError, setImageError] = useState(false);
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
  } = useAvatar({ userId: user?.id });

  useEffect(() => {
    setImageError(false);
  }, [displayAvatar]);

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

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
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
          user.id,
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

  const showImage = displayAvatar && !imageError;

  return (
    <div className="profile-avatar-container">
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-image-wrapper">
          {showImage ? (
            <Image
              src={displayAvatar}
              width={128}
              height={128}
              alt="Аватар профиля"
              className="profile-avatar-image"
              onError={handleImageError}
              priority
              unoptimized={displayAvatar.includes('vk.com') || displayAvatar.includes('userapi.com')}
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <User />
            </div>
          )}
        </div>

        {isUploading && (
          <div className="profile-avatar-overlay">
            <div className="profile-avatar-spinner" />
          </div>
        )}

        <label className="profile-avatar-upload-btn">
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
          className="profile-avatar-camera-btn"
          title="Сделать фото"
        >
          <Camera />
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

      <div className="profile-avatar-info">
        <p className="profile-avatar-info-title">
          Нажмите на иконки для смены аватара
        </p>
        <p className="profile-avatar-info-status">
          {isUploading ? "Загрузка..." : "Сделать фото или загрузить файл"}
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;