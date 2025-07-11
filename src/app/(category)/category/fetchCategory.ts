const fetchProductsByCategory = async (
  category: string,
  options: {
    pagination: { startIdx: number; perPage: number };
    filter?: string | string[];
  }
) => {
  const { pagination, filter } = options;

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`);

    url.searchParams.append("category", category);
    url.searchParams.append("startIdx", pagination.startIdx.toString());
    url.searchParams.append("perPage", pagination.perPage.toString());

    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((f) => url.searchParams.append("filter", f));
      } else {
        url.searchParams.append("filter", filter);
      }
    }

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

    if (!res.ok)
      throw new Error(`Серверная ошибка получения продуктов категории`);

    const data = await res.json();

    console.log(data);

    return {
      items: data.products || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (err) {
    throw err;
  }
};

export default fetchProductsByCategory;
