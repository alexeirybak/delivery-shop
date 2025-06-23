import { fetchArticles } from "./fetchArticles";
import ArticlesSection from "./ArticlesSection";

const Articles = async () => {
  try {
    const articles = await fetchArticles();

    return (
      <ArticlesSection
        title="Статьи"
        viewAllButton={{ text: "Все статьи", href: "articles" }}
        articles={articles}
        compact // Включаем адаптивное поведение 3/4 товара
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить статьи</div>
    );
  }
};

export default Articles;
