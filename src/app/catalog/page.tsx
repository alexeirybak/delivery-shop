import GridCategoryBlock from "@/components/GridCategoryBlock";
import { gridLayoutCategories } from "../../../utils/gridLayoutCategories";

export default function CategoryPage() {
  return (
    <section className="px-[max(12px,calc((100%-1208px)/2)] mb-20 mx-auto">
      <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
        <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141] mb-15">
          Каталог
        </h2>
      </div>
      <div className="grid grid-cols-[repeat(2,160px)] md:grid-cols-[repeat(3,224px)] xl:grid-cols-[repeat(4,272px)] auto-rows-[200px] gap-4 md:gap-8 lgxl:gap-10 text-lg">
        {gridLayoutCategories.map((block) => (
          <div
            key={block.id}
            className={`
        ${block.mobileColSpan || ""}
        ${block.tabletColSpan || ""}
        ${block.colSpan || ""}
        bg-gray-200
      `}
          >
            <GridCategoryBlock id={block.id} colSpan={block.colSpan} />
          </div>
        ))}
      </div>
    </section>
  );
}
