import fetchArticles from "./fetchArticles";
import ArticleSection from "./ArticlesSection";
import { CONFIG } from "../../../config/config";

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
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить статьи</div>
    );
  }
};

export default Articles;
