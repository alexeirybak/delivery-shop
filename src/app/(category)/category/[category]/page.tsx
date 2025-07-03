const CategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  let category: string = "";

  try {
    category = (await params).category;
  } catch (error) {
    console.error("Ошибка получения категории:", error);
  }
  return <div>Страница категории: {category}</div>;
};

export default CategoryPage;
