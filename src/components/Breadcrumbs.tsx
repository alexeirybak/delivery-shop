"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { TRANSLATIONS } from "../../utils/translations";
import { Suspense } from "react";
import MiniLoader from "./MiniLoader";
import { useProduct } from "@/app/contexts/ProductContext";
import { useArticle } from "@/app/contexts/ArticleContext";
import { useCategory } from "@/app/contexts/CategoryContext";

function BreadcrumbsContent() {
  const pathname = usePathname();
  const { title } = useProduct();
  const { articleTitle } = useArticle();
  const { categoryTitle } = useCategory();

  if (pathname === "/" || pathname === "/search") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const productDesc = title;

  const isArticlePage = pathSegments[0] === "blog" && pathSegments.length >= 3;
  const isCategoryPage =
    pathSegments[0] === "blog" && pathSegments.length === 2;

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    let label = TRANSLATIONS[segment] || segment;

    // Если это страница товара
    if (
      index === pathSegments.length - 1 &&
      productDesc &&
      pathSegments.includes("catalog") &&
      pathSegments.length >= 3
    ) {
      label = productDesc;
    }

    if (isCategoryPage && index === pathSegments.length - 1 && categoryTitle) {
      label = categoryTitle;
    }

    if (isArticlePage && index === pathSegments.length - 2 && categoryTitle) {
      label = categoryTitle;
    }

    if (isArticlePage && index === pathSegments.length - 1 && articleTitle) {
      label = articleTitle;
    }

    let finalHref = href;

    const isLastItem = index === pathSegments.length - 1;
    const isBlogPage = isArticlePage || isCategoryPage;

    if (isLastItem && !isBlogPage) {
      finalHref = `${href}?desc=${productDesc}`;
    }

    return {
      label,
      href: finalHref,
      isLast: isLastItem,
    };
  });

  breadcrumbs.unshift({
    label: "Главная",
    href: "/",
    isLast: false,
  });

  return (
    <nav className="px-[max(12px,calc((100%-1208px)/2))] my-6">
      <ol className="flex items-center gap-4 text-[8px] md:text-xs flex-wrap">
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
                <span title={item.label} className="line-clamp-1">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href}>
                  <span title={item.label} className="line-clamp-1">
                    {item.label}
                  </span>
                </Link>
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
