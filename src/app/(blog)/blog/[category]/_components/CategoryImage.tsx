import Image from "next/image";
import { CategoryImageProps } from "../../types";

const CategoryImage = ({
  category,
  gradientColor,
  hasImage,
}: CategoryImageProps) => {
  if (hasImage && category.image) {
    return (
      <div className="relative mb-6 w-full max-w-[400px] h-[200px] md:h-[200px] mx-auto rounded overflow-hidden shadow-lg">
        <Image
          src={category.image}
          alt={category.imageAlt || category.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 800px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`mb-6 w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden shadow-lg bg-linear-to-br ${gradientColor} flex items-center justify-center`}
    >
      <div className="text-center p-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryImage;
