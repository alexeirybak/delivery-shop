import Link from "next/link";
import Image from "next/image";
import { GridCategoryBlockProps } from "@/types/categoryBlockProps";

const GridCategoryBlock = ({
  slug,
  title,
  img,
  priority = false,
}: GridCategoryBlockProps) => {
  return (
    <Link
      href={`/catalog/${slug}`}
      className="block relative h-full overflow-hidden group min-w-40 md:min-w-[224px] xl:min-w-[274px]"
    >
      <Image
        src={img}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform group-hover:scale-105"
        priority={priority}
        quality={priority ? 90 : 75}
        loading={priority ? "eager" : "lazy"}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(112,192,91,0)_0%,rgba(112,192,91,0.82)_82.813%)] h-[117px] top-auto
                  group-hover:bg-[linear-gradient(180deg,rgba(255,102,51,0)_0%,rgba(255,102,51,1)_100%)] group-hover:h-[177px] transition-all duration-300"
      ></div>
      <div className="absolute left-2.5 right-2.5 bottom-2.5 flex items-center">
        <span className="text-white text-lg font-bold break-words whitespace-normal max-w-[calc(100%-10px)]">
          {title}
        </span>
      </div>
    </Link>
  );
};

export default GridCategoryBlock;
