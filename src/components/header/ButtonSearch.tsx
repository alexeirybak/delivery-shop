import Image from "next/image";

const ButtonSearch = () => {
  return (
    <button className="bg-(--color-primary) hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) hidden md:flex w-10 p-2 gap-4 lg:w-35 cursor-pointer duration-300 rounded">
      <Image
        src="/icons-header/icon-menu.svg"
        alt="menu"
        width={24}
        height={24}
        className="hidden md:block"
      />
      <span className="text-base text-white hidden lg:block">Каталог</span>
    </button>
  );
};

export default ButtonSearch;
