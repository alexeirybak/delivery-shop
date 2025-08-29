"use client";

import Image from "next/image";

interface ConfirmAvatarModalProps {
  isOpen: boolean;
  previewUrl: string;
  isUploading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmAvatarModal = ({
  isOpen,
  previewUrl,
  isUploading,
  onConfirm,
  onCancel,
}: ConfirmAvatarModalProps) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Подтверждение смены аватара
        </h3>

        <div className="flex justify-center mb-4">
          <Image
            src={previewUrl}
            width={80}
            height={80}
            alt="Превью аватара"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        <p className="text-gray-600 mb-6 text-center">
          Вы уверены, что хотите сменить аватар? Старое изображение будет
          удалено.
        </p>

        <div className="flex gap-3 w-full">
          <button
            disabled={isUploading}
            onClick={onConfirm}
            className="flex-1 bg-primary text-white py-2 rounded hover:bg-green-600 duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUploading ? "Загрузка" : "Да, сменить"}
          </button>
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="flex-1 bg-[#f3f2f1] rounded hover:shadow-button-secondary py-2 active:shadow-(--shadow-button-active) disabled:opacity-50 text-[#606060] duration-300 cursor-pointer"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAvatarModal;
