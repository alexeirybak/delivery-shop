import ViewAllButton from "@/components/ViewAllButton";
import { ArticlesSectionProps } from "@/types/articlesSection";
import ArticleCard from "./ArticleCard";

const ArticlesSection = ({
  title,
  viewAllButton,
  articles,
  compact = false,
}: ArticlesSectionProps) => {
  return (
    <section>
      <div
        className={`flex flex-col ${
          !compact ? "px-[max(12px,calc((100%-1208px)/2))] mt-20" : ""
        }`}
      >
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            {title}
          </h2>
          <ViewAllButton
            btnText={viewAllButton.text}
            href={viewAllButton.href}
          />
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
          {articles.map((article, index) => (
            <li
              key={article._id}
              className={`h-75 md:h-105 ${
                compact
                  ? `
            ${index >= 4 ? "hidden" : ""}
            ${index >= 3 ? "md:hidden" : ""}
            ${index >= 3 ? "xl:block" : ""}
            ${index >= 4 ? "xl:hidden" : ""}
          `
                  : ""
              }`}
            >
              <ArticleCard {...article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ArticlesSection;
