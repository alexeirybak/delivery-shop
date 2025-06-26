import Link from "next/link";
import Image from "next/image";
import { categoryTitles } from "../../utils/categoryTitles";

const GridCategoryBlock = ({ id, colSpan }: { id: number; colSpan?: string }) => {
  const getSizes = () => {
    if (colSpan === "col-span-2") {
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 544px";
    }
    return "(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 272px";
  };

  return (
    <Link
      href={`/category-${id}`}
      className="block relative w-full h-full overflow-hidden group"
    >
      <Image
        src={`/images/categories/img-${id}.png`}
        alt={categoryTitles[id]}
        fill
        sizes={getSizes()}
        className="object-cover transition-transform group-hover:scale-105"
      />
      {/* Градиентный слой */}
      <div className="absolute inset-0 
        bg-[linear-gradient(180deg,rgba(112,192,91,0)_0%,rgba(112,192,91,0.82)_82.813%)]
        h-[117px] top-auto
        group-hover:bg-[linear-gradient(180deg,rgba(255,102,51,0)_0%,rgba(255,102,51,1)_100%)]
        group-hover:h-[177px]
        transition-all duration-300" />
      
      <div className="absolute left-2.5 bottom-2.5 flex items-center justify-center">
        <span className="text-white text-lg font-bold">{categoryTitles[id]}</span>
      </div>
    </Link>
  );
};

export default GridCategoryBlock;