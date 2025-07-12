import PriceFilter from "./PriceFilter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export default function DropFilter({
  basePath,
  activeFilter,
  priceFrom,
  priceTo,
  inStock,
}: {
  basePath: string;
  activeFilter?: string | string[];
  priceFrom?: string;
  priceTo?: string;
  inStock?: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="mb-4 gap-2">
          <Filter size={16} />
          Фильтры
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <PriceFilter
            basePath={basePath}
            category="" // можно передать реальное значение если нужно
            initialPriceFrom={priceFrom}
            initialPriceTo={priceTo}
          />

          {/* Здесь можно добавить другие фильтры */}
          {/* Например: */}
          {/* <InStockFilter inStock={inStock} basePath={basePath} /> */}
          {/* <CategoryFilter activeFilter={activeFilter} basePath={basePath} /> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
