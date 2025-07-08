import ErrorComponent from "@/components/ErrorComponent";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  let productId: string = "";

  try {
    productId = (await params).id;
  } catch (error) {
      return (
        <ErrorComponent
          error={error instanceof Error ? error : new Error(String(error))}
          userMessage="Не удалось загрузить данные о продукте"
        />
      );
    }
  return <div>Страница продукта: {productId}</div>;
};

export default ProductPage;
