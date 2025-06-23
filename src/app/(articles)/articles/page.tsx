import fetchArticles from "../fetchArticles";
import ArticleSection from "../ArticlesSection";

export const metadata = {
  title: 'Статьи на сайте магазина "Северяночка"',
  description: 'Читайте статьи на сайте магазина "Северяночка"',
};

const AllArticles = async () => {
  try {
    const articles = await fetchArticles();

    return (
      <ArticleSection
        title="Все статьи"
        viewAllButton={{ text: "На главную", href: "/" }}
        articles={articles}
      />
    );
  } catch {
    return (
      <div className="text-red-500">Ошибка: не удалось загрузить статьи</div>
    );
  }
};

export default AllArticles;
