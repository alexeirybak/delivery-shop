export interface CameraModalProps {
  isOpen: boolean;
  isCameraReady: boolean;
  isUploading: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClose: () => void;
  onVideoLoaded: () => void;
  onTakePhoto: () => void;
}

export interface ConfirmAvatarModalProps {
  isOpen: boolean;
  previewUrl: string;
  isUploading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
