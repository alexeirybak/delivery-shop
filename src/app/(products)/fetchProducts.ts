const fetchProductsByCategory = async (
  category: string,
  options?: {
    randomLimit?: number;
    pagination?: { startIdx: number; perPage: number };
  }
) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
    url.searchParams.append("category", category);

    if (options?.randomLimit) {
      url.searchParams.append("randomLimit", options.randomLimit.toString());
    } else if (options?.pagination) {
      url.searchParams.append(
        "startIdx",
        options.pagination.startIdx.toString()
      );
      url.searchParams.append("perPage", options.pagination.perPage.toString());
    }

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

    if (!res.ok)
      throw new Error(`Серверная ошибка получения продуктов ${category}`);

    const data = await res.json();

    return {
      items: data.products || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (err) {
    console.error(`Ошибка в компоненте: ${category}`, err);
    throw err;
  }
};

export default fetchProductsByCategory;
