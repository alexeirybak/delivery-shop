"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getAvatarByGender } from "../../../../utils/getAvatarByGender";
import IconAvatarChange from "@/components/svg/IconAvatarChange";

const ProfileAvatar = ({ gender }: { gender: string }) => {
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDisplayAvatar = () => {
    return currentAvatar || getAvatarByGender(gender);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = getAvatarByGender(gender);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(file);

    // Показываем превью перед загрузкой
    const reader = new FileReader(); // FileReader для чтения содержимого файла и преобразования его в Data URL (base64 строку).
    reader.onload = (event) => {
      if (event.target?.result) {
        const previewUrl = event.target.result as string;
        console.log(previewUrl);
        setPreviewUrl(previewUrl);
        // Сохраняем файл и показываем подтверждение
        setPendingFile(file);
        setShowConfirmModal(true);
      }
    };
    reader.readAsDataURL(file);
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
          priority //Ссылка на скрытый элемент <input type="file">, чтобы активировать его кликом на иконку
        />
        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 duration-300">
          <input
            ref={fileInputRef} // Ссылка на скрытый элемент <input type="file">, чтобы активировать его кликом на иконку
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            //disabled={isUploading}
          />
          <IconAvatarChange />
        </label>
        {showConfirmModal && (
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
                  //onClick={handleAvatarConfirm}
                  //disabled={isUploading}
                  className="flex-1 bg-primary text-white py-2 rounded hover:bg-green-600 duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >Да, сменить
                  {/* {isUploading ? "Загрузка..." : "Да, сменить"} */}
                </button>
                <button
                  //onClick={handleAvatarCancel}
                  //disabled={isUploading}
                  className="flex-1 bg-[#f3f2f1] rounded hover:shadow-button-secondary py-2 active:shadow-(--shadow-button-active) disabled:opacity-50 text-[#606060] duration-300 cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
