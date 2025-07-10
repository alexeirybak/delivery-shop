"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FILTERS = [
  { key: "our-production", label: "Товары нашего производства" },
  { key: "healthy-food", label: "Полезное питание" },
  { key: "non-gmo", label: "Без ГМО" },
];

// Резервные значения диапазона цен
const FALLBACK_PRICE_RANGE = { min: 0, max: 10000 };

export default function FilterButtons({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Параметры из URL
  const currentFilters = searchParams.getAll("filter");
  const currentPage = searchParams.get("page");
  const urlPriceFrom = searchParams.get("priceFrom") || "";
  const urlPriceTo = searchParams.get("priceTo") || "";
  const category = searchParams.get("category");

  // Состояния компонента
  const [priceRange, setPriceRange] = useState(FALLBACK_PRICE_RANGE);
  const [inputValues, setInputValues] = useState({
    from: urlPriceFrom,
    to: urlPriceTo,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получение данных с сервера
  const fetchPriceData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Формируем параметры запроса
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      currentFilters.forEach((f) => params.append("filter", f));

      // Добавляем параметр для получения только диапазона цен
      params.set("getPriceRangeOnly", "true");

      const response = await fetch(`/api/category?${params.toString()}`, {
        next: { revalidate: 3600 }, // Кэширование на 1 час
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      // Проверяем и устанавливаем диапазон цен
      const receivedRange = data.priceRange || FALLBACK_PRICE_RANGE;
      setPriceRange({
        min: Math.floor(Number(receivedRange.min)) || FALLBACK_PRICE_RANGE.min,
        max: Math.ceil(Number(receivedRange.max)) || FALLBACK_PRICE_RANGE.max,
      });

      // Устанавливаем значения из URL или диапазон по умолчанию
      setInputValues({
        from:
          urlPriceFrom || String(receivedRange.min || FALLBACK_PRICE_RANGE.min),
        to: urlPriceTo || String(receivedRange.max || FALLBACK_PRICE_RANGE.max),
      });
    } catch (err) {
      console.error("Ошибка получения данных:", err);
      setError(
        "Не удалось загрузить диапазон цен. Используются стандартные значения."
      );
      setPriceRange(FALLBACK_PRICE_RANGE);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchPriceData();
  }, [searchParams.toString()]);

  // Обработчики событий
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setInputValues((prev) => ({ ...prev, [name]: numericValue }));
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Валидация значений
    let fromValue = Math.max(
      priceRange.min,
      parseInt(inputValues.from) || priceRange.min
    );

    let toValue = Math.min(
      priceRange.max,
      parseInt(inputValues.to) || priceRange.max
    );

    // Корректировка если "от" > "до"
    if (fromValue > toValue) [fromValue, toValue] = [toValue, fromValue];

    // Обновляем параметры URL
    params.set("priceFrom", fromValue.toString());
    params.set("priceTo", toValue.toString());
    params.delete("page");

    router.push(`${basePath}?${params.toString()}`);
  };

  const handleSliderChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setInputValues({
        from: values[0].toString(),
        to: values[1].toString(),
      });
    }
  };

  const handleSliderAfterChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setInputValues({
        from: values[0].toString(),
        to: values[1].toString(),
      });
      applyPriceFilter();
    }
  };

  // Вспомогательные функции
  const buildFilterLink = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentFilters.includes(filterKey)) {
      params.delete("filter");
      currentFilters
        .filter((f) => f !== filterKey)
        .forEach((f) => params.append("filter", f));
    } else {
      params.append("filter", filterKey);
    }

    params.delete("page");
    return `${basePath}?${params.toString()}`;
  };

  const buildClearFiltersLink = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");
    params.delete("priceFrom");
    params.delete("priceTo");
    if (currentPage) params.set("page", currentPage);
    return `${basePath}?${params.toString()}`;
  };

  const isFilterActive = (filterKey: string) =>
    currentFilters.includes(filterKey);

  // Рассчитываем значения для ползунка
  const sliderValues = [
    inputValues.from ? parseInt(inputValues.from) : priceRange.min,
    inputValues.to ? parseInt(inputValues.to) : priceRange.max,
  ];

  // Состояния UI
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 items-center p-4">
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full" />
        {FILTERS.map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 h-10 w-40 rounded-full"
          />
        ))}
        <div className="animate-pulse bg-gray-200 h-24 w-80 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-wrap gap-4 items-center p-4">
        <div className="text-red-600 bg-red-100 p-2 rounded">
          {error} Диапазон: {priceRange.min} - {priceRange.max} ₽
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Кнопка "Все товары" */}
      <Link
        href={buildClearFiltersLink()}
        className={`px-4 py-2 rounded-full text-sm ${
          currentFilters.length === 0 && !urlPriceFrom && !urlPriceTo
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Все товары
      </Link>

      {/* Кнопки фильтров */}
      {FILTERS.map((filter) => (
        <Link
          key={filter.key}
          href={buildFilterLink(filter.key)}
          className={`px-4 py-2 rounded-full text-sm ${
            isFilterActive(filter.key)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {filter.label}
        </Link>
      ))}

      {/* Фильтр по цене */}
      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="from"
            value={inputValues.from}
            onChange={handleInputChange}
            placeholder={`${priceRange.min}`}
            min={priceRange.min}
            max={priceRange.max}
            className="w-20 p-2 border rounded"
            onBlur={applyPriceFilter}
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
            className="w-20 p-2 border rounded"
            onBlur={applyPriceFilter}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
          />
          <button
            onClick={applyPriceFilter}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Применить
          </button>
        </div>

        <div className="w-64 px-2">
          <Slider
            range
            min={priceRange.min}
            max={priceRange.max}
            value={sliderValues}
            onChange={handleSliderChange}
            onChangeComplete={handleSliderAfterChange}
            styles={{
              track: {
                backgroundColor: "#3b82f6",
              },
              handle: {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 2px #3b82f6",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}