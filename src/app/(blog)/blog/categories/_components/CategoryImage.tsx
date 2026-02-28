import Image from "next/image";

import { CategoryImageProps } from "../types/categories.types";
import { getImagePath } from "../utils/getImagePath";

export default function CategoryImage({
  hasImage,
  image,
  imageAlt,
  gradientClass,
  name,
  priority,
}: CategoryImageProps) {
  const imagePath = getImagePath(hasImage ? image : "");
  console.log(imagePath);

  return (
    <div className="relative w-full h-48">
      {hasImage ? (
        <Image
          src={imagePath}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          quality={75}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center bg-linear-to-br ${gradientClass} rounded-t`}
        >
          <div className="text-white text-center p-4">
            <div className="text-white text-xl font-semibold leading-tight px-4">
              {name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
