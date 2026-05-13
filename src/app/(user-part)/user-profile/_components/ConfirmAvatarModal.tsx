"use client";

import Image from "next/image";
import "../styles/confirm-avatar-modal.css";
import { ConfirmAvatarModalProps } from "./types";

const ConfirmAvatarModal = ({
  isOpen,
  previewUrl,
  isUploading,
  onConfirm,
  onCancel,
}: ConfirmAvatarModalProps) => {
  if (!isOpen) return null;

 return (
  <div className="confirm-modal-overlay">
    <div className="confirm-modal">
      <h3 className="confirm-modal-title">Подтверждение смены аватара</h3>

      <div className="confirm-modal-avatar">
        <div className="confirm-avatar-preview">
          <Image
            src={previewUrl}
            width={96}
            height={96}
            alt="Превью аватара"
            className="confirm-avatar-image"
          />
        </div>
      </div>

      <p className="confirm-modal-message">
        Вы уверены, что хотите сменить аватар? Старое изображение будет
        удалено.
      </p>

      <div className="confirm-modal-buttons">
        <button
          disabled={isUploading}
          onClick={onConfirm}
          className="confirm-button-primary"
        >
          {isUploading ? "Загрузка..." : "Да, сменить"}
        </button>
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="confirm-button-secondary"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
);
};

export default ConfirmAvatarModal;
