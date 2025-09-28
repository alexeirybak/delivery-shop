"use client";

import Image from "next/image";
import iconCart from "/public/icons-header/icon-cart.svg";
import IconMenuMob from "../svg/IconMenuMob";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import IconBox from "../svg/IconBox";
import IconHeart from "../svg/IconHeart";

const TopMenu = () => {
  const pathname = usePathname();
  const isCatalogPage = pathname === "/catalog";
  const isFavoritesPage = pathname === "/favorites";
  const { user } = useAuthStore();

  const isManagerOrAdmin = user?.role === "manager" || user?.role === "admin";

  return (
    <ul className="flex flex-row gap-x-6 items-end">
      <Link
        href="/catalog"
        className="flex flex-col items-center gap-2.5 md:hidden w-11 cursor-pointer"
      >
        <IconMenuMob isCatalogPage={isCatalogPage} />
        <span className={isCatalogPage ? "text-[#ff6633]" : "text-main-text"}>
          Каталог
        </span>
      </Link>
      {!isManagerOrAdmin && (
        <Link
          href="/favorites"
          className="flex flex-col items-center gap-2.5 w-11 cursor-pointer"
        >
          <IconHeart isActive={isFavoritesPage} variant="orange" />{" "}
          <span className={isFavoritesPage ? "text-[#ff6633]" : ""}>
            Избранное
          </span>
        </Link>
      )}

      <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
        <IconBox />
        <span className={isManagerOrAdmin ? "text-[#ff6633]" : ""}>Заказы</span>
      </li>
      {!isManagerOrAdmin && (
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
      )}
    </ul>
  );
};

export default TopMenu;
