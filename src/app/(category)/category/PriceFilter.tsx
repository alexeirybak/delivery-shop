"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FALLBACK_PRICE_RANGE = { min: 0, max: 3000 };

interface PriceFilterProps {
  basePath: string;
  category?: string;
}

export default function PriceFilter({ basePath, category }: PriceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPriceFrom = searchParams.get("priceFrom") || "";
  const urlPriceTo = searchParams.get("priceTo") || "";
  const urlInStock = searchParams.get("inStock") === "true";

  const [priceRange, setPriceRange] = useState(FALLBACK_PRICE_RANGE);
  const [inputValues, setInputValues] = useState({
    from: urlPriceFrom,
    to: urlPriceTo,
  });
  const [inStock, setInStock] = useState(urlInStock);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      try {
        const currentCategory = category || searchParams.get("category");
        if (!currentCategory) return;

        const params = new URLSearchParams();
        params.set("category", currentCategory);
        params.set("getPriceRangeOnly", "true");

        const response = await fetch(`/api/category?${params.toString()}`);
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

        const data = await response.json();
        const receivedRange = data.priceRange || FALLBACK_PRICE_RANGE;

        setPriceRange({
          min:
            Math.floor(Number(receivedRange.min)) || FALLBACK_PRICE_RANGE.min,
          max: Math.ceil(Number(receivedRange.max)) || FALLBACK_PRICE_RANGE.max,
        });

        setInputValues({
          from:
            urlPriceFrom ||
            String(receivedRange.min || FALLBACK_PRICE_RANGE.min),
          to:
            urlPriceTo || String(receivedRange.max || FALLBACK_PRICE_RANGE.max),
        });
      } catch (error) {
        console.error("Ошибка загрузки диапазона цен:", error);
        setPriceRange(FALLBACK_PRICE_RANGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceData();
  }, [category, searchParams, urlPriceFrom, urlPriceTo]);

  const applyPriceFilter = () => {
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
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStock(e.target.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setInputValues({
        from: values[0].toString(),
        to: values[1].toString(),
      });
    }
  };

  const sliderValues = [
    inputValues.from ? parseInt(inputValues.from) : priceRange.min,
    inputValues.to ? parseInt(inputValues.to) : priceRange.max,
  ];

  if (isLoading) return <div>Загрузка диапазона цен...</div>;

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
        <input
          type="checkbox"
          id="inStock"
          checked={inStock}
          onChange={handleInStockChange}
          className="w-4 h-4 text-[#70c05b] rounded focus:ring-[#70c05b]"
        />
        <label htmlFor="inStock" className="text-sm cursor-pointer">
          Только в наличии
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
