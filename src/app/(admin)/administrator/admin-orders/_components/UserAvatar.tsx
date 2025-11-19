import Image from "next/image";
import { useState, useEffect } from "react";
import { checkAvatarExists } from "../../../../../../utils/avatarUtils";
import { getAvatarByGender } from "../../../../../../utils/getAvatarByGender";

interface UserAvatarProps {
  userId?: string;
  gender?: string;
  name: string;
}

const UserAvatar = ({ userId, gender, name }: UserAvatarProps) => {
  const [avatarSrc, setAvatarSrc] = useState<string>("");

  useEffect(() => {
    const checkAvatar = async () => {
      if (userId) {
        try {
          const exists = await checkAvatarExists(userId);
          if (exists) {
            setAvatarSrc(`/api/auth/avatar/${userId}?t=${Date.now()}`);
          } else {
            setAvatarSrc(getAvatarByGender(gender));
          }
        } catch {
          setAvatarSrc(getAvatarByGender(gender));
        }
      } else if (gender) {
        setAvatarSrc(getAvatarByGender(gender));
      }
    };

    checkAvatar();
  }, [userId, gender]);

  const handleAvatarError = () => {
    if (gender) {
      setAvatarSrc(getAvatarByGender(gender));
    }
  };

  if (avatarSrc) {
    return (
      <Image
        src={avatarSrc}
        alt={`Аватар ${name}`}
        width={40}
        height={40}
        onError={handleAvatarError}
        className="rounded-full object-cover min-w-10 min-h-10"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default UserAvatar;