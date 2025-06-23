import fetchArticles from "./fetchArticles";
import ArticleSection from "./ArticlesSection";

const Articles = async () => {
  try {
    const articles = await fetchArticles();

    return (
      <ArticleSection
        title="Статьи"
        viewAllButton={{ text: "Все статьи", href: "articles" }}
        articles={articles}
        compact
      />
    );
  } catch {
    return <div className="text-red-500">Ошибка: не удалось загрузить статьи</div>;
  }
};

export default Articles;
