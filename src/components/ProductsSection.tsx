import ProductCard from "@/components/ProductCard";
import ViewAllButton from "@/components/ViewAllButton";
import { ProductsSectionProps } from "@/types/productsSection";

const ProductsSection = ({
  title,
  viewAllButton,
  products,
  applyIndexStyles = true,
  contentType,
}: ProductsSectionProps & {
  applyIndexStyles?: boolean;
  contentType?: string;
}) => {
  const gridClasses =
    contentType === "category"
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

  return (
    <section>
      <div className="flex flex-col px-[max(12px,calc((100%-1208px)/2))]">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            {title}
          </h2>
          {viewAllButton && (
            <ViewAllButton
              btnText={viewAllButton.text}
              href={viewAllButton.href}
            />
          )}
        </div>
        {products && products.length > 0 ? (
          <ul
            className={`grid ${gridClasses} gap-4 md:gap-6 xl:gap-10 justify-items-center`}
          >
            {products.map((item, index) => (
              <li
                key={item._id}
                className={
                  applyIndexStyles
                    ? index >= 3
                      ? "md:hidden xl:block"
                      : ""
                    : ""
                }
              >
                <ProductCard {...item} />
              </li>
            ))}
          </ul>
        ) : (
          <div>Товары не найдены</div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
