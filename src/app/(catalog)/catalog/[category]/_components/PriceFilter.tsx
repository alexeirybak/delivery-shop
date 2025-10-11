"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CONFIG } from "../../../../../../config/config";
import { PriceFilterProps, PriceRange } from "@/types/priceTypes";
import MiniLoader from "@/components/MiniLoader";
import ErrorComponent from "@/components/ErrorComponent";
import PriceFilterHeader from "./PriceFilterHeader";
import PriceInputs from "./PriceInputs";
import PriceRangeSlider from "./PriceRangeSlider";
import InStockToggle from "../../../../../components/InStockToggle";

const PriceFilter = ({
  basePath,
  category,
  setIsFilterOpenAction,
  apiEndpoint = "/category",
  userId, 
}: PriceFilterProps & { apiEndpoint?: string }) => {
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

      if (userId) {
        params.set("userId", userId);
      }

      const response = await fetch(`/api/${apiEndpoint}?${params.toString()}`);

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      const data = await response.json();
      const receivedRange = data.priceRange || CONFIG.FALLBACK_PRICE_RANGE;

      const roundedRange = {
        min: Math.floor(Number(receivedRange.min)),
        max: Math.ceil(Number(receivedRange.max)),
      };

      setPriceRange(roundedRange);

      setInputValues({
        from: urlPriceFrom || roundedRange.min.toString(),
        to: urlPriceTo || roundedRange.max.toString(),
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
  }, [category, searchParams, urlPriceFrom, urlPriceTo, apiEndpoint, userId]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyPriceFilter();
    if (setIsFilterOpenAction) setIsFilterOpenAction(false);
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

  const handleSliderChange = useCallback((values: [number, number]) => {
    setInputValues({
      from: values[0].toString(),
      to: values[1].toString(),
    });
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

  if (isLoading || isNaN(priceRange.min) || isNaN(priceRange.max)) {
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
      className="flex flex-col gap-y-10 text-main-text"
    >
      <PriceFilterHeader onResetAction={resetPriceFilter} />
      <PriceInputs
        from={inputValues.from}
        to={inputValues.to}
        min={priceRange.min}
        max={priceRange.max}
        onFromChangeAction={(value: string) =>
          setInputValues((prev) => ({ ...prev, from: value }))
        }
        onToChangeAction={(value: string) =>
          setInputValues((prev) => ({ ...prev, to: value }))
        }
      />
      <PriceRangeSlider
        min={priceRange.min}
        max={priceRange.max}
        values={sliderValues}
        onChangeAction={handleSliderChange}
      />
      <InStockToggle
        checked={inStock}
        onChangeAction={(checked) => setInStock(checked)}
        labelText="В наличии"
      />
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
