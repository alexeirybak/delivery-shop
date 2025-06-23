import { fetchArticles } from "../fetchArticles";
import ArticlesSection from "../ArticlesSection";

const AllArticles = async () => {
  try {
    const articles = await fetchArticles();
    return (
      <ArticlesSection
        title="Все статьи"
        viewAllButton={{ text: "На главную", href: "/" }}
        articles={articles} // Без compact - выводятся все статьи
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: Не удалось загрузить статьи</div>
    );
  }
};

export default AllArticles;
