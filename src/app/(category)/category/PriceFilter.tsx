"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";

const FALLBACK_PRICE_RANGE = { min: 0, max: 3000 };

interface PriceFilterProps {
  basePath: string;
  category?: string;
}

type PriceRange = {
  min: number;
  max: number;
};

export default function PriceFilter({ basePath, category }: PriceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPriceFrom = searchParams.get("priceFrom") || "";
  const urlPriceTo = searchParams.get("priceTo") || "";
  const urlInStock = searchParams.get("inStock") === "true";

  const [priceRange, setPriceRange] =
    useState<PriceRange>(FALLBACK_PRICE_RANGE);
  const [inputValues, setInputValues] = useState({
    from: urlPriceFrom,
    to: urlPriceTo,
  });
  const [inStock, setInStock] = useState(urlInStock);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const fetchPriceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentCategory = category || searchParams.get("category");
      if (!currentCategory) return;

      const params = new URLSearchParams({
        category: currentCategory,
        getPriceRangeOnly: "true",
      });

      const response = await fetch(`/api/category?${params.toString()}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const receivedRange = data.priceRange || FALLBACK_PRICE_RANGE;

      const newRange = {
        min: Math.floor(Number(receivedRange.min)) || FALLBACK_PRICE_RANGE.min,
        max: Math.ceil(Number(receivedRange.max)) || FALLBACK_PRICE_RANGE.max,
      };

      setPriceRange(newRange);
      setInputValues({
        from: urlPriceFrom || String(newRange.min),
        to: urlPriceTo || String(newRange.max),
      });
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось ранжировать по цене",
      });
      setPriceRange(FALLBACK_PRICE_RANGE);
    } finally {
      setIsLoading(false);
    }
  }, [category, searchParams, urlPriceFrom, urlPriceTo]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const applyPriceFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    let fromValue = Math.max(
      priceRange.min,
      parseInt(inputValues.from) || priceRange.min
    );
    let toValue = Math.min(
      priceRange.max,
      parseInt(inputValues.to) || priceRange.max
    );

    if (fromValue > toValue) [fromValue, toValue] = [toValue, fromValue];

    params.set("priceFrom", fromValue.toString());
    params.set("priceTo", toValue.toString());
    params.set("inStock", inStock.toString());
    params.delete("page");

    router.push(`${basePath}?${params.toString()}`);
  }, [basePath, inStock, inputValues, priceRange, router, searchParams]);

  const handleInStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInStock(e.target.checked);
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSliderChange = useCallback((values: number | number[]) => {
    if (Array.isArray(values)) {
      setInputValues({
        from: values[0].toString(),
        to: values[1].toString(),
      });
    }
  }, []);

  const sliderValues = [
    parseInt(inputValues.from) || priceRange.min,
    parseInt(inputValues.to) || priceRange.max,
  ];

  if (isLoading) return <MiniLoader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  return (
    <div className="flex flex-col gap-y-10 text-[#414141]">
      <div className="flex flex-row items-center justify-between gap-2">
        <input
          type="number"
          name="from"
          value={inputValues.from}
          onChange={handleInputChange}
          placeholder={`${priceRange.min}`}
          min={priceRange.min}
          max={priceRange.max}
          className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
          onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
        />
        <span>-</span>
        <input
          type="number"
          name="to"
          value={inputValues.to}
          onChange={handleInputChange}
          placeholder={`${priceRange.max}`}
          min={priceRange.min}
          max={priceRange.max}
          className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
          onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
        />
      </div>
      <div className="w-64 px-2">
        <Slider
          range
          min={priceRange.min}
          max={priceRange.max}
          value={sliderValues}
          onChange={handleSliderChange}
          styles={{
            track: {
              backgroundColor: "#70c05b",
              height: 4,
            },
            handle: {
              width: 20,
              height: 20,
              backgroundColor: "#70c05b",
              border: "1px solid #ffffff",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              marginTop: -8,
              cursor: "pointer",
              opacity: 1,
            },
            rail: {
              backgroundColor: "#f0f0f0",
              height: 4,
            },
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={handleInStockChange}
            className="sr-only peer"
          />
          <div className="w-[46px] h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#70c05b] transition-colors duration-200">
            <div
              className={`
                absolute top-0.5 left-0
                w-5 h-5
                border-[0.5px] border-[rgba(0,0,0,0.04)]
                rounded-full
                shadow-[0px_1px_1px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.15)]
                bg-white
                transition-transform duration-300
                ${
                  inStock
                    ? "transform translate-x-6"
                    : "transform translate-x-0"
                }
              `}
            ></div>
          </div>
          <span className="ml-2 text-sm text-[#414141]">Только в наличии</span>
        </label>
      </div>
      <button
        onClick={applyPriceFilter}
        className="bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center duration-300 cursor-pointer"
      >
        Применить
      </button>
    </div>
  );
}
