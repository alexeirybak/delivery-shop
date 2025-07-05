export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let categoryId: string; // Объявляем переменную вне блока try
  
  try {
    categoryId = (await params).id;
    // Здесь вы можете получить данные категории по id
    // и отобразить их на странице
  } catch (error) {
    console.error("Error fetching category:", error);
    // Можно вернуть заглушку или сообщение об ошибке
    return <div>Error loading category</div>;
  }
  
  return (
    <div>
      <h1>Category Page XXXXXX666: {categoryId}</h1>
      {/* Здесь будет контент категории */}
    </div>
  );
}