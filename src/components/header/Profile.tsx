import Image from "next/image";
import avatar from "/public/images/graphics/avatar.png";
import iconArrow from "/public/icons-header/icon-arrow.svg";
import Link from "next/link";

const Profile = () => {
  const user = false;

  if (!user) {
    return (
      <Link
        href="/login"
        className="ml-6 w-10 xl:w-[157px] flex justify-between items-center gap-x-2 p-2 rounded text-white text-base bg-[#ff6633] hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300"
      >
        <div className="w-[109px] justify-center hidden xl:flex">
          <p>Войти</p>
        </div>
        <Image
          src="/icons-header/icon-entry.svg"
          alt="Войти"
          width={24}
          height={24}
        />
      </Link>
    );
  }

  return (
    <div className="ml-6 p-2 flex flex-1 justify-end items-center gap-2.5">
      <Image
        src={avatar}
        alt="Ваш профиль"
        width={40}
        height={40}
        className="min-w-10 min-h-10"
      />
      <p className="hidden xl:block cursor-pointer p-2.5">Алексей</p>
      <button className="hidden xl:block cursor-pointer p-2">
        <Image
          src={iconArrow}
          alt="Меню профиля"
          width={24}
          height={24}
          sizes="24px"
        />
      </button>
    </div>
  );
};

export default Profile;
