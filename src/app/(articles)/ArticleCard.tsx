import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  _id: string;
  name: string;
  image: string;
  imageAlt: string;
  categoryName: string;
  description: string;
  createdAt: string;
}

const ArticleCard = ({
  _id, // Используем _id вместо slug
  name,
  image,
  imageAlt,
  categoryName,
  description,
  createdAt,
}: ArticleCardProps) => {
  // Ссылка на статью по _id
  const articleUrl = `/blog/articles/${_id}`;
  console.log("ArticleCard _id:", _id);
  return (
    <Link href={articleUrl} className="block h-full">
      <article className="bg-white h-full flex flex-col rounded overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-article) duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={imageAlt || name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {categoryName}
            </span>
            <time className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString("ru-RU")}
            </time>
          </div>

          <h3 className="text-lg font-bold mb-2 line-clamp-2">{name}</h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
            {description}
          </p>

          <div className="mt-auto">
            <div className="w-full py-2 text-center bg-[#E5FFDE] text-[#70C05B] rounded hover:bg-[#70C05B] hover:text-white duration-300">
              Подробнее
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
