import ProductCard from "@/components/ProductCard";
import ViewAllButton from "@/components/ViewAllButton";
import { ProductsSectionProps } from "@/types/productsSection";

const ProductsSection = ({
  title,
  viewAllButton,
  products,
  compact = false,
}: ProductsSectionProps) => {
  return (
    <section>
      <div
        className={`flex flex-col ${
          !compact ? "px-[max(12px,calc((100%-1208px)/2))] mt-20" : ""
        }`}
      >
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            {title}
          </h2>
          <ViewAllButton
            btnText={viewAllButton.text}
            href={viewAllButton.href}
          />
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
          {products.map((item, index) => (
            <li
              key={item._id}
              className={
                compact
                  ? `
                /* На мобильных (по умолчанию): 2 колонки, но ограничиваем общее количество */
                ${index >= 4 ? "hidden" : ""}
                
                /* На md экранах: 3 колонки, показываем только первые 3 */
                ${index >= 3 ? "md:hidden" : ""}
                
                /* На xl экранах: 4 колонки, показываем первые 4 */
                ${index >= 3 ? "xl:block" : ""}
                ${index >= 4 ? "xl:hidden" : ""}
              `
                  : ""
              }
            >
              <ProductCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProductsSection;
