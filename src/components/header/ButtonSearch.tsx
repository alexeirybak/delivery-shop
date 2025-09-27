import Image from "next/image";
import Link from "next/link";

const ButtonSearch = () => {
  return (
    <Link
      href="/catalog"
      className="bg-primary hover:shadow-button-default active:shadow-button-active hidden md:flex w-10 p-2 gap-4 lg:w-35 cursor-pointer duration-300 rounded"
    >
      <div className="relative w-6 h-6 hidden md:block">
        <Image
          src="/icons-header/icon-menu.svg"
          alt="menu"
          width={24}
          height={24}
          className="object-contain"
          sizes="24px"
        />
      </div>

      <span className="text-base text-white hidden lg:block">Каталог</span>
    </Link>
  );
};

export default ButtonSearch;
