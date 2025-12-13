"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { TRANSLATIONS } from "../../utils/translations";
import { Suspense } from "react";
import MiniLoader from "./MiniLoader";
import { useProduct } from "@/app/contexts/ProductContext";

function BreadcrumbsContent() {
  const pathname = usePathname();
  const { title } = useProduct();

  if (pathname === "/" || pathname === "/search") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const productDesc = title;

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    let label = TRANSLATIONS[segment] || segment;

    if (
      index === pathSegments.length - 1 &&
      productDesc &&
      pathSegments.includes("catalog") &&
      pathSegments.length >= 3
    ) {
      label = productDesc;
    }

    return {
      label,
      href:
        index === pathSegments.length - 1
          ? `${href}?desc=${productDesc}`
          : href,
      isLast: index === pathSegments.length - 1,
    };
  });

  breadcrumbs.unshift({
    label: "Главная",
    href: "/",
    isLast: false,
  });

  return (
    <nav className="px-[max(12px,calc((100%-1208px)/2))] my-6">
      <ol className="flex items-center gap-4 text-[8px] md:text-xs">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center gap-4">
            <div
              className={
                item.isLast
                  ? "text-[#8f8f8f]"
                  : "text-main-text hover:underline cursor-pointer"
              }
            >
              {item.isLast ? (
                item.label
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </div>
            {!item.isLast && (
              <Image
                src="/icons-products/icon-arrow-right.svg"
                alt={`Переход от ${item.label} к ${
                  breadcrumbs[breadcrumbs.length - 1].label
                }`}
                width={24}
                height={24}
                sizes="24px"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const Breadcrumbs = () => {
  return (
    <Suspense fallback={<MiniLoader />}>
      <BreadcrumbsContent />
    </Suspense>
  );
};

export default Breadcrumbs;
