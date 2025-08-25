"use client";

import Image from "next/image";
import { getAvatarByGender } from "../../../../../utils/getAvatarByGender";
import IconAvatarChange from "@/components/svg/IconAvatarChange";

interface AvatarUploadProps {
  avatar: string;
  gender: string; 
  isEditing: boolean;
  onAvatarChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const ProfileAvatar = ({
  avatar,
  gender,
  isEditing,
  onAvatarChangeAction,
  className = "",
}: AvatarUploadProps) => {
  const getCurrentAvatar = () => {
    return avatar || getAvatarByGender(gender); // передаем объект с gender
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = getAvatarByGender(gender); // используем утилиту для fallback
  };

  return (
    <div className={`flex flex-col items-center mb-8 ${className}`}>
      <div className="relative group">
        <Image
          src={getCurrentAvatar()}
          width={128}
          height={128}
          alt="Аватар"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        {isEditing && (
          <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-[#5da84a] duration-300">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onAvatarChangeAction}
            />
            <IconAvatarChange />
          </label>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
