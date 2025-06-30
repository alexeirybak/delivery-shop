import { ArticleCardProps } from "@/types/articles";

const fetchArticles = async (params?: { articlesLimit?: number }) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`;

    // Добавляем параметр в URL, если он передан
    if (params?.articlesLimit) {
      url += `?articlesLimit=${params.articlesLimit}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Серверная ошибка получения статей`);

    const articles: ArticleCardProps[] = await res.json();

    return articles;
  } catch (err) {
    console.error("Ошибка при получении статей:", err);
    throw err;
  }
};

export default fetchArticles;
