import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product";
import { getPurchases } from "../../../utils/api-routes";
import ViewAllButton from "@/components/ViewAllButton";

const AllPurchases = async () => {
  let purchases: ProductCardProps[] = [];
  let error = null;

  try {
    purchases = (await getPurchases()) as unknown as ProductCardProps[];
  } catch (err) {
    error = "Не удается получить данные о Ваших покупках, попробуйте позже";
    console.error("Ошибка в компоненте Purchases:", err);
  }

  if (error) {
    return <div className="text-red-500 py-8">Ошибка: {error}</div>;
  }

  return (
    <section className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col md:mb-25 xl:mb-30 w-full mx-auto mb-20 mt-20 justify-center text-[#414141]">
      <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between text-[#414141]">
        <h2 className="text-2xl xl:text-4xl text-left font-bold">
          Покупали раньше
        </h2>
        {purchases.length > 0 && (
          <ViewAllButton btnText="Все покупки" href="/" />
        )}
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
        {purchases.map((item) => (
          <li key={item._id}>
            <ProductCard {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AllPurchases;
