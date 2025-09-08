"use client";

import Image from "next/image";
import iconHeart from "/public/icons-header/icon-heart.svg";
import iconBox from "/public/icons-header/icon-box.svg";
import iconCart from "/public/icons-header/icon-cart.svg";
import IconMenuMob from "../svg/IconMenuMob";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TopMenu = () => {
  const pathname = usePathname();
  const isCatalogPage = pathname === "/catalog";

  return (
    <ul className="flex flex-row gap-x-6 items-end">
      <Link href="/catalog">
        <li className="flex flex-col items-center gap-2.5 md:hidden w-11 cursor-pointer">
          <IconMenuMob isCatalogPage={isCatalogPage}/>
          <span className={isCatalogPage ? "text-[#ff6633]" : "text-[#414141]"}>Каталог</span>
        </li>
      </Link>

      <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
        <Image
          src={iconHeart}
          alt="Избранное"
          width={24}
          height={24}
          className="object-contain w-6 h-6"
        />
        <span>Избранное</span>
      </li>
      <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
        <Image
          src={iconBox}
          alt="Заказы"
          width={24}
          height={24}
          className="object-contain w-6 h-6"
        />
        <span>Заказы</span>
      </li>
      <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
        <Image
          src={iconCart}
          alt="Корзина"
          width={24}
          height={24}
          className="object-contain w-6 h-6"
        />
        <span>Корзина</span>
      </li>
    </ul>
  );
};

export default TopMenu;
