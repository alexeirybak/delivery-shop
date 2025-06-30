const fetchProductsByCategory = async (
  category: string,
  params?: { randomLimit?: number }
) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${category}`;
    
    // Добавляем параметр randomLimit если он передан
    if (params?.randomLimit) {
      url += `&randomLimit=${params.randomLimit}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Ошибка при загрузке продуктов ${category}`);
    
    return await res.json();
  } catch (err) {
    console.error(`Ошибка в компоненте: ${category}`, err);
    throw err;
  }
};

export default fetchProductsByCategory;
