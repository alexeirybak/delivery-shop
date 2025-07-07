import Link from "next/link";
import Image from "next/image";
import { GridCategoryBlockProps } from "@/types/categoryBlockProps";

const GridCategoryBlock = ({ slug, title, img, priority = false }: GridCategoryBlockProps) => {
  return (
    <Link
      href={`/category/${slug}`}
      className="block relative h-full overflow-hidden group min-w-40 md:min-w-[224px] xl:min-w-[274px]"
      prefetch={false} // Отключаем prefetch для ссылок
    >
      <div className="relative w-full h-full">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
          priority={priority}
          quality={priority ? 90 : 75}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(112,192,91,0.82)] via-transparent to-transparent h-[117px] top-auto group-hover:bg-[linear-gradient(180deg,rgba(255,102,51,0)_0%,rgba(255,102,51,1)_100%)] group-hover:h-[177px] transition-all duration-300" />
      <div className="absolute left-2.5 bottom-2.5 right-2.5">
        <span className="text-white text-lg font-bold break-words whitespace-normal line-clamp-2">
          {title}
        </span>
      </div>
    </Link>
  );
};

export default GridCategoryBlock;