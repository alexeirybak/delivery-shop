"use client";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CONFIG } from "../../../../config/config";
import { PriceFilterProps, PriceRange } from "@/types/priceTypes";
import MiniLoader from "@/components/MiniLoader";
import ErrorComponent from "@/components/ErrorComponent";

const PriceFilter = ({ basePath, category }: PriceFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPriceFrom = searchParams.get("priceFrom") || "";
  const urlPriceTo = searchParams.get("priceTo") || "";
  const urlInStock = searchParams.get("inStock") === "true";

  const [inputValues, setInputValues] = useState({
    from: urlPriceFrom,
    to: urlPriceTo,
  });
  const [priceRange, setPriceRange] = useState<PriceRange>(
    CONFIG.FALLBACK_PRICE_RANGE
  );
  const [inStock, setInStock] = useState(urlInStock);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchPriceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentCategory = category || searchParams.get("category");
      if (!currentCategory) return;

      const params = new URLSearchParams();

      params.set("category", currentCategory);
      params.set("getPriceRangeOnly", "true");

      const response = await fetch(`/api/category?${params.toString()}`);

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      const data = await response.json();
      const receivedRange = data.priceRange || CONFIG.FALLBACK_PRICE_RANGE;

      setPriceRange({
        min: Math.floor(parseInt(receivedRange.min)),
        max: Math.ceil(parseInt(receivedRange.max)),
      });

      setInputValues({
        from: urlPriceFrom || receivedRange.min.toString(),
        to: urlPriceTo || receivedRange.max.toString(),
      });
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить каталог категорий",
      });
      setPriceRange(CONFIG.FALLBACK_PRICE_RANGE);
      setInputValues({
        from: CONFIG.FALLBACK_PRICE_RANGE.min.toString(),
        to: CONFIG.FALLBACK_PRICE_RANGE.max.toString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [category, searchParams, urlPriceFrom, urlPriceTo]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyPriceFilter();
  };

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

    router.push(`${basePath}?${params.toString()}`);
  }, [
    searchParams,
    priceRange.min,
    priceRange.max,
    inputValues.from,
    inputValues.to,
    inStock,
    router,
    basePath,
  ]);

  const sliderValues = [
    parseInt(inputValues.from) || priceRange.min,
    parseInt(inputValues.to) || priceRange.max,
  ];

  const handleInStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInStock(e.target.checked);
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

  const resetPriceFilter = useCallback(() => {
    setInputValues({
      from: priceRange.min.toString(),
      to: priceRange.max.toString(),
    });

    const params = new URLSearchParams(searchParams.toString());

    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("page");

    router.push(`${basePath}?${params.toString()}`);
  }, [basePath, priceRange.max, priceRange.min, router, searchParams]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  if (isLoading) {
    return <MiniLoader />;
  }

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-10 text-[#414141] mt-10 xl:mt-0"
    >
      <div className="flex flex-row justify-between items-center">
        <p className="text-black text-base">Цена</p>
        <button
          type="button"
          onClick={resetPriceFilter}
          className="text-xs rounded bg-[#f3f2f1] h-8 p-2 cursor-pointer"
        >
          Очистить
        </button>
      </div>
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
        />
        <Image
          src="/icons-products/icon-line.svg"
          alt="до"
          width={24}
          height={24}
        />
        <input
          type="number"
          name="to"
          value={inputValues.to}
          onChange={handleInputChange}
          placeholder={`${priceRange.max}`}
          min={priceRange.min}
          max={priceRange.max}
          className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
        />
      </div>
      <div className="w-[320px] xl:w-[272px] px-2 mx-auto">
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
          <span className="ml-2 text-sm text-[#414141]">В наличии</span>
        </label>
      </div>
      <button
        type="submit"
        className="bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center duration-300 cursor-pointer"
      >
        Применить
      </button>
    </form>
  );
};

export default PriceFilter;
