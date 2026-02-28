"use client";

import Image from "next/image";

interface CameraModalProps {
  isOpen: boolean;
  isCameraReady: boolean;
  isUploading: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClose: () => void;
  onVideoLoaded: () => void;
  onTakePhoto: () => void;
}

const CameraModal = ({
  isOpen,
  isCameraReady,
  isUploading,
  videoRef,
  canvasRef,
  onClose,
  onVideoLoaded,
  onTakePhoto,
}: CameraModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 rounded">
      <div className="w-full max-w-sm p-4 bg-white rounded">
        <h3 className="mb-4 text-lg font-semibold text-center">
          Сделайте фото
        </h3>

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedData={onVideoLoaded}
            className="w-full h-full mx-auto mb-4 bg-gray-200 rounded"
          />
          {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex w-full gap-3 text-xs md:text-sm">
          <button
            onClick={onTakePhoto}
            disabled={!isCameraReady || isUploading}
            className="flex-1 text-white px-3 bg-primary hover:bg-[#039b03] hover:shadow-button-default active:shadow-button-active cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed transition-custom"
          >
            <div className="flex flex-row items-center justify-center gap-x-2 md:gap-x-4">
              <Image
                src="/icons-auth/icon-camera.png"
                alt="Фото"
                width={24}
                height={24}
              />
              {isCameraReady ? " Снять фото" : "Загрузка..."}
            </div>
          </button>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 bg-[#f3f2f1] border-none rounded flex hover:shadow-button-secondary p-2 justify-center items-center active:shadow-button-active cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
        </div>

        {!isCameraReady && (
          <p className="mt-2 text-xs text-center text-gray-500">
            Камера запускается...
          </p>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
