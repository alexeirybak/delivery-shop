import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product";
import { getProductsByCategory } from "@/app/api/products/route";
import ViewAllButton from "@/components/ViewAllButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Все новинки магазина 'Северяночка'",
  description: "Список всех новинок",
};

export default async function AllNew() {
  let products: ProductCardProps[] = [];
  let error = null;

  try {
    products = (await getProductsByCategory(
      "new"
    )) as unknown as ProductCardProps[];
  } catch (err) {
    error = "Не удается получить данные об акциях, попробуйте позже";
    console.error("Ошибка в компоненте AllNew:", err);
  }

  if (error) {
    return <div className="text-red-500 py-8">Ошибка: {error}</div>;
  }

  return (
    <section className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col md:mb-25 xl:mb-30 w-full mx-auto mb-20 mt-20 justify-center text-[#414141]">
      <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
        <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
          Новинки
        </h2>
        <ViewAllButton btnText="На главную" href="/" />
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
        {products.map((item) => (
          <li key={item._id}>
            <ProductCard {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
