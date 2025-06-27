import ViewAllButton from "@/components/ViewAllButton";
import { ArticlesSectionProps } from "@/types/articlesSection";
import ArticleCard from "./ArticleCard";

const ArticleSection = ({
  title,
  viewAllButton,
  articles,
  compact = false,
}: ArticlesSectionProps) => {
  return (
    <section>
      <div
        className={`flex flex-col text-[#414141] ${
          !compact ? "px-[max(12px,calc((100%-1208px)/2))]" : "mt-20"
        }`}
      >
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold">{title}</h2>
          {viewAllButton && (
            <ViewAllButton
              btnText={viewAllButton.text}
              href={viewAllButton.href}
            />
          )}
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <li
              key={article._id}
              className={`h-75 md:h-105 ${index >= 3 ? "hidden" : ""}`}
            >
              <ArticleCard {...article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ArticleSection;
