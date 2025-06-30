const fetchPurchases = async (params?: { userPurchasesLimit?: number }) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/purchases`;
    
    // Добавляем параметр в URL, если он передан
    if (params?.userPurchasesLimit) {
      url += `?userPurchasesLimit=${params.userPurchasesLimit}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Ошибка при загрузке покупок");
    
    return await res.json();
  } catch (err) {
    console.error("Ошибка при загрузке покупок:", err);
    throw err;
  }
};

export default fetchPurchases;
