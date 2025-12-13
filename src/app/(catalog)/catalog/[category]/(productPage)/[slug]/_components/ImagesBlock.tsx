import { ProductCardProps } from "@/types/product";
import Image from "next/image";

const ImagesBlock = ({ product }: { product: ProductCardProps }) => {
  return (
    <div className="flex flex-row gap-x-4 h-[248px] xl:h-[496px] justify-center">
      <div className="flex flex-col justify-between h-full shrink-0">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="relative bg-white w-16 h-[37px] xl:h-[86px] flex items-center justify-center overflow-hidden shrink-0"
          >
            <Image
              src={product.img}
              alt={`${product.title} - миниатюра ${index + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ))}
      </div>

      <div
        className="relative flex justify-center items-center shadow-image-block bg-white 
                     h-[248px] xl:h-[496px] 
                     w-[248px] md:w-[272px] xl:w-[504px] 
                     p-2.5 shrink-0"
      >
        <Image
          src={product.img}
          alt={product.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 248px, (max-width: 1032px) 272px, 504px"
          priority
        />
        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-5 right-5 bg-[#ff6633] text-white px-2 py-1 rounded text-sm">
            -{product.discountPercent}%
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImagesBlock;
