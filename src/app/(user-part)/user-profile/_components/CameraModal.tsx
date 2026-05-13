import { Camera } from "lucide-react";
import "../styles/camera-modal.css";
import { CameraModalProps } from "./types";

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
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <h3 className="camera-modal-title">Сделайте фото</h3>

        <div className="camera-video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedData={onVideoLoaded}
            className="camera-video"
          />
          {!isCameraReady && (
            <div className="camera-loader">
              <div className="camera-spinner" />
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="camera-canvas" />

        <div className="camera-buttons">
          <button
            onClick={onTakePhoto}
            disabled={!isCameraReady || isUploading}
            className="camera-button-primary"
          >
            <Camera className="camera-icon" />
            <span>{isCameraReady ? "Снять фото" : "Загрузка..."}</span>
          </button>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="camera-button-secondary"
          >
            Отмена
          </button>
        </div>

        {!isCameraReady && <p className="camera-hint">Камера запускается...</p>}
      </div>
    </div>
  );
};

export default CameraModal;
