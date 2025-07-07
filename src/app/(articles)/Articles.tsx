import fetchArticles from "./fetchArticles";
import ArticleSection from "./ArticlesSection";
import { CONFIG } from "../../../config/config";
import ErrorComponent from "@/components/ErrorComponent";

const Articles = async () => {
  try {
    const { items } = await fetchArticles({
      articlesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES,
    });

    return (
      <ArticleSection
        title="Статьи"
        viewAllButton={{ text: "Все статьи", href: "articles" }}
        articles={items}
      />
    );
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
        userMessage="Не удалось загрузить статьи"
      />
    );
  }
};

export default Articles;
