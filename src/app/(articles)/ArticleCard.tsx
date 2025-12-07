// app/components/ArticleCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  createdAt: string;
  text: string;
  slug: string;
  content?: string;
}

const ArticleCard = ({ 
  title, 
  createdAt, 
  text,
  slug,
  content
}: ArticleCardProps) => {
  
  // Простая функция для получения первого изображения
  const getFirstImage = () => {
    if (!content) return '/placeholder-article.jpg';
    
    // Ищем первую картинку
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    
    if (match && match[1]) {
      return match[1]; // Это будет "/uploads/....png"
    }
    
    return '/placeholder-article.jpg';
  };

  return (
    <article className="bg-white h-full flex flex-col rounded overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-article) duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={getFirstImage()}
          alt={title}
          fill
          className="object-cover"
          priority={false}
          quality={100}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-2.5 flex-1 flex flex-col gap-y-2.5 leading-[1.5]">
        <time className="text-[8px] text-[#8f8f8f]">
          {new Date(createdAt).toLocaleDateString("ru-RU")}
        </time>
        <h3 className="text-main-text text-base font-bold xl:text-lg">
          {title}
        </h3>
        <p className="text-main-text line-clamp-3 text-xs xl:text-base">
          {text}
        </p>
        <Link 
          href={`/${slug}`}
          className="rounded mt-auto w-37.5 h-10 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-primary hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) duration-300 cursor-pointer flex items-center justify-center"
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;