import Image from "next/image";
import Link from "next/link";
import { getColorFromName } from "../(blog)/blog/categories/utils/getColorFromName";
import { ArticleCardProps } from "@/types/articles";

const ArticleCard = ({
  slug,
  categorySlug,
  name,
  image,
  imageAlt,
  categoryName,
  description,
  publishedAt,
}: ArticleCardProps) => {
  const articleUrl = `/blog/${categorySlug}/${slug}`;
  const gradientClass = getColorFromName(name);

  return (
    <Link href={articleUrl} className="block h-full">
      <article className="bg-white h-full flex flex-col rounded overflow-hidden shadow-card hover:shadow-article transition-custom">
        <div className="relative h-48 w-full">
          {image ? (
            <Image
              src={image}
              alt={imageAlt || name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-main-text rounded">
              {categoryName}
            </span>
            <time className="text-xs text-gray-500">
              {new Date(publishedAt).toLocaleDateString("ru-RU")}
            </time>
          </div>

          <h3 className="text-lg text-main-text font-bold mb-2 line-clamp-2">
            {name}
          </h3>

          <p className="text-main-text text-sm line-clamp-3 mb-4 flex-1">
            {description}
          </p>

          <div className="mt-auto">
            <div className="w-full py-2 text-center bg-[#E5FFDE] text-[#70C05B] rounded hover:bg-[#70C05B] hover:text-white transition-custom">
              Подробнее
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
