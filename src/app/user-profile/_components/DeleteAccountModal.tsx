"use client";

import { useEffect } from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#fcd5bacc] bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded p-6 shadow-xl max-w-md w-full mx-auto my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#414141] mb-4">
          Подтверждение удаления
        </h3>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя
          отменить.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex flex-1 items-center justify-center h-10 bg-[#f3f2f1] text-[#606060] px-4 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active duration-300 cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center h-10 bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 rounded font-medium duration-300 cursor-pointer"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
