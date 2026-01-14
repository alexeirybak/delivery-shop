import ViewAllButton from "@/components/ViewAllButton";
import ArticleCard from "./ArticleCard";

interface Article {
  _id: string;
  name: string;
  image: string;
  imageAlt: string;
  categoryName: string;
  description: string;
  createdAt: string;
}

interface ArticleSectionProps {
  title: string;
  viewAllButton?: {
    text: string;
  };
  articles: Article[];
}

const ArticleSection = ({
  title,
  viewAllButton,
  articles,
}: ArticleSectionProps) => {
  return (
    <section className="px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {title}
          </h2>
          {viewAllButton && (
            <ViewAllButton
              btnText={viewAllButton.text}
              href="/blog"
            />
          )}
        </div>
        
        {articles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Пока нет статей
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article._id} className="h-full">
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleSection;