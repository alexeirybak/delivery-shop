import { ProductCardProps } from "@/types/product";

interface FetchProductsResponse {
  items: ProductCardProps[];
  totalCount: number;
}

const fetchProductsByCategory = async (
  category: string,
  options: {
    pagination: { startIdx: number; perPage: number };
    filter?: string;
  }
): Promise<FetchProductsResponse> => {
  const { pagination, filter } = options;

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`);

    // Явное преобразование чисел в строки
    url.searchParams.append("category", category);
    url.searchParams.append("startIdx", String(pagination.startIdx));
    url.searchParams.append("perPage", String(pagination.perPage));

   if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach(f => url.searchParams.append("filter", f));
      } else {
        url.searchParams.append("filter", filter);
      }
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    console.log(data);

    return {
      items: data.products,
      totalCount: data.totalCount,
    };
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error("Failed to load category products");
  }
};

export default fetchProductsByCategory;
