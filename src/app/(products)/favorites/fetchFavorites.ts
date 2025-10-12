const fetchFavorites = async (options: {
  pagination: { startIdx: number; perPage: number };
  filter?: string | string[];
  priceFrom?: string;
  priceTo?: string;
  inStock?: boolean;
  userId?: string | null;
}) => {
  const { pagination, filter, priceFrom, priceTo, inStock, userId } = options;

  try {
    if (!userId) {
      return {
        items: [],
        totalCount: 0,
      };
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/favorites/products`
    );

    url.searchParams.append("startIdx", pagination.startIdx.toString());
    url.searchParams.append("perPage", pagination.perPage.toString());
    url.searchParams.append("userId", userId);

    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((f) => url.searchParams.append("filter", f));
      } else {
        url.searchParams.append("filter", filter);
      }
    }

    if (priceFrom) {
      url.searchParams.append("priceFrom", priceFrom);
    }

    if (priceTo) {
      url.searchParams.append("priceTo", priceTo);
    }

    if (inStock !== undefined) {
      url.searchParams.append("inStock", inStock.toString());
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Ошибка получения избранного: ${res.status}`);
    }

    const data = await res.json();

    return {
      items: data.products || [],
      totalCount: data.totalCount || 0,
    };
  } catch (err) {
    throw err;
  }
};

export default fetchFavorites;
