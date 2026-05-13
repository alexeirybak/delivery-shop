"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { DeleteAccountModalProps } from "./types";
import "../styles/delete-account-modal.css";

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  error,
}) => {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-icon">
            <AlertTriangle className="modal-icon" />
          </div>
          <h3 className="modal-title">Удаление аккаунта</h3>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        <p className="modal-warning-text">
          Вы действительно хотите удалить свой аккаунт?
        </p>

        <div className="modal-consequences">
          <p className="consequences-title">Что произойдет:</p>
          <ul className="consequences-list">
            <li>Все Ваши данные будут безвозвратно удалены</li>
            <li>История обучения и достижения будут потеряны</li>
            <li>Доступ к платформе будет закрыт</li>
            <li className="consequences-highlight">
              <AlertTriangle size={12} className="consequences-icon" />
              Оплаченные подписки и средства НЕ ВОЗВРАЩАЮТСЯ
            </li>
          </ul>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
