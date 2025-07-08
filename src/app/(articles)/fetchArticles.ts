const fetchArticles = async (options?: {
  articlesLimit?: number;
  pagination?: { startIdx: number; perPage: number };
}) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`);

    if (options?.articlesLimit) {
      url.searchParams.append(
        "articlesLimit",
        options.articlesLimit.toString()
      );
    } else if (options?.pagination) {
      url.searchParams.append(
        "startIdx",
        options.pagination.startIdx.toString()
      );
      url.searchParams.append("perPage", options.pagination.perPage.toString());
    }

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

    if (!res.ok) throw new Error("Серверная ошибка получения статей");

    const data = await res.json();

    return {
      items: data.articles || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (err) {
    throw err;
  }
};

export default fetchArticles;
