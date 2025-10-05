"use client";

import { useEffect, useState, useCallback } from "react";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../../../utils/calcPrices";
import {
  getOrderCartAction,
  getUserBonusesAction,
  removeMultipleOrderItemsAction,
  updateOrderItemQuantityAction,
} from "@/actions/orderActions";
import { useCartStore } from "@/store/cartStore";
import { Loader } from "@/components/Loader";
import { ProductCardProps } from "@/types/product";
import { CONFIG } from "../../../../config/config";
import CartHeader from "./_components/CartHeader";
import CartControls from "./_components/CartControls";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";
import BonusesSection from "./_components/BonusesSection";

const CartPage = () => {
  // Состояние для отслеживания выбранных товаров (массив ID товаров)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // Состояние для хранения данных о товарах (объект, где ключи - ID товаров, значения - данные товаров)
  const [productsData, setProductsData] = useState<{
    [key: string]: ProductCardProps;
  }>({});
  // Состояние для количества доступных бонусов пользователя
  const [bonusesCount, setBonusesCount] = useState<number>(0);
  // Состояние, указывающее есть ли у пользователя карта лояльности
  const [hasLoyaltyCard, setHasLoyaltyCard] = useState<boolean>(false);
  // Состояние для отслеживания удаленных товаров (чтобы скрыть их из интерфейса без немедленного удаления из store)
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  // Состояние загрузки данных корзины (показывает индикатор загрузки)
  const [isCartLoading, setIsCartLoading] = useState(true);
  // Флаг использования бонусов для оплаты заказа
  const [useBonuses, setUseBonuses] = useState<boolean>(false);
  // Получение данных корзины и функции обновления из глобального состояния (Zustand store)
  const { cartItems, updateCart } = useCartStore();
  // Фильтруем удаленные товары - показываем только те, что не в списке удаленных
  // Это оптимистичное обновление UI до подтверждения удаления с сервера
  const visibleCartItems = cartItems.filter(
    (item) => !removedItems.includes(item.productId)
  );

  // Асинхронная функция загрузки данных корзины и товаров
  const fetchCartAndProducts = async () => {
    setIsCartLoading(true); // Включаем индикатор загрузки
    try {
      // Получаем данные пользователя (бонусы и карту лояльности)
      const userData = await getUserBonusesAction();
      setBonusesCount(userData.bonusesCount); // Устанавливаем количество бонусов
      setHasLoyaltyCard(userData.hasLoyaltyCard); // Устанавливаем статус карты лояльности

      // Загружаем актуальные данные корзины с сервера
      const cartItems = await getOrderCartAction();

      // ОБНОВЛЯЕМ STORE данными из сервера (синхронизируем локальное состояние с сервером)
      updateCart(cartItems);

      // Создаем массив промисов для параллельной загрузки данных о каждом товаре
      const productPromises = cartItems.map(async (item) => {
        try {
          // Запрашиваем данные товара по API
          const response = await fetch(`/api/products/${item.productId}`);
          const product = await response.json();
          return { productId: item.productId, product }; // Возвращаем ID и данные товара
        } catch (error) {
          console.error(`Ошибка получения продукта ${item.productId}:`, error);
          return null; // В случае ошибки возвращаем null
        }
      });

      // Ожидаем завершения всех запросов к API товаров
      const productsResults = await Promise.all(productPromises);
      const productsMap: { [key: string]: ProductCardProps } = {};

      // Преобразуем массив результатов в объект для быстрого доступа по ID товара
      productsResults.forEach((result) => {
        if (result && result.product) {
          productsMap[result.productId] = result.product; // Сохраняем товар по его ID
        }
      });

      setProductsData(productsMap); // Устанавливаем данные товаров в состояние
    } catch (error) {
      console.error("Ошибка получения данных корзины:", error);
    } finally {
      setIsCartLoading(false); // Выключаем индикатор загрузки в любом случае
    }
  };

  useEffect(() => {
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Функция обновления количества товара (мемоизирована для оптимизации перерендеров)
  const handleQuantityUpdate = useCallback(
    async (productId: string, newQuantity: number) => {
      // Оптимистичное обновление store - сразу меняем UI до ответа сервера
      const updatedCartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCartItems); // Обновляем глобальное состояние

      try {
        // Синхронизируем изменение с сервером
        await updateOrderItemQuantityAction(productId, newQuantity);
      } catch (error) {
        console.error("Ошибка обновления количества:", error);
        // Откат к предыдущему состоянию при ошибке (пессимистичное обновление)
        updateCart(cartItems);
      }
    },
    [cartItems, updateCart] // Зависимости для useCallback
  );

  // Функция удаления выбранных товаров
  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return; // Выходим если нечего удалять

    // СРАЗУ убираем товары из рендеринга (оптимистичное обновление UI)
    setRemovedItems((prev) => [...prev, ...selectedItems]);

    // Фильтруем товары в store, удаляя выбранные
    const updatedCartItems = cartItems.filter(
      (item) => !selectedItems.includes(item.productId)
    );
    updateCart(updatedCartItems); // Обновляем глобальное состояние

    try {
      // Удаляем в фоне - НЕ ЖДЕМ ОТВЕТА (неблокирующий запрос)
      removeMultipleOrderItemsAction(selectedItems);
      setSelectedItems([]); // Очищаем выбранные товары
    } catch (error) {
      console.error("Ошибка удаления товаров:", error);
      // Откат изменений при ошибке - возвращаем товары в видимые
      setRemovedItems((prev) =>
        prev.filter((id) => !selectedItems.includes(id))
      );
      updateCart(cartItems); // Восстанавливаем предыдущее состояние store
    }
  };

  // Выделить все товары в корзине
  const selectAllItems = () => {
    setSelectedItems(visibleCartItems.map((item) => item.productId));
  };

  // Снять выделение со всех товаров
  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // Обработчик выбора/снятия выбора отдельного товара
  const handleItemSelection = useCallback(
    (productId: string, isSelected: boolean) => {
      if (isSelected) {
        setSelectedItems((prev) => [...prev, productId]); // Добавляем к выбранным
      } else {
        setSelectedItems((prev) => prev.filter((id) => id !== productId)); // Удаляем из выбранных
      }
    },
    []
  );

  // Расчет общей стоимости ВСЕХ товаров в корзине
  const totalPrice = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total; // Пропускаем если данные товара не загружены

    // Рассчитываем цену с учетом скидки на товар
    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    // Применяем скидку по карте лояльности, если у пользователя есть карта
    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
      : priceWithDiscount;

    return total + finalPrice * item.quantity; // Суммируем с учетом количества
  }, 0);

  // Расчет общей максимальной цены (базовые цены без скидок по карте лояльности)
  const totalMaxPrice = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    return total + priceWithDiscount * item.quantity;
  }, 0);

  // Расчет общей суммы скидки (разница между ценой без карты и ценой с картой)
  const totalDiscount = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
      : priceWithDiscount;

    // Скидка = (цена без карты - цена с картой) * количество
    const itemDiscount = (priceWithDiscount - finalPrice) * item.quantity;

    return total + itemDiscount;
  }, 0);

  // Максимальное количество бонусов, которые можно использовать (не более 30% от суммы и не более доступных бонусов)
  const maxBonusUse = Math.min(
    bonusesCount,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  // Итоговая цена с учетом использованных бонусов (не может быть отрицательной)
  const finalPrice = useBonuses
    ? Math.max(0, totalPrice - maxBonusUse) // Используем бонусы, но не меньше 0
    : totalPrice; // Без использования бонусов

  // Расчет общего количества бонусов, которые будут начислены за покупку
  const totalBonuses = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );
    // Начисляем бонусы в процентах от цены товара (из конфига)
    const bonuses = priceWithDiscount * (CONFIG.BONUSES_PERCENT / 100);

    return total + Math.round(bonuses) * item.quantity; // Округляем и умножаем на количество
  }, 0);

  // Проверка достижения минимальной суммы заказа (1000 рублей)
  const isMinimumReached = finalPrice >= 1000;

  // Проверка, выбраны ли все товары в корзине
  // true если есть выбранные товары и их количество равно общему количеству видимых товаров
  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === visibleCartItems.length;

  if (isCartLoading) {
    return <Loader />;
  }

  if (visibleCartItems.length === 0 && removedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Корзина</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Корзина пуста</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] text-main-text mx-auto">
      <CartHeader itemCount={visibleCartItems.length} />

      <CartControls
        isAllSelected={isAllSelected}
        selectedItemsCount={selectedItems.length}
        onSelectAll={selectAllItems}
        onDeselectAll={deselectAllItems}
        onRemoveSelected={handleRemoveSelected}
      />

      <div className="flex flex-col md:flex-row gap-8 xl:gap-x-15">
        <div className="flex flex-col gap-y-6">
          {visibleCartItems.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              productData={productsData[item.productId]}
              isSelected={selectedItems.includes(item.productId)}
              onSelectionChange={handleItemSelection}
              onQuantityUpdate={handleQuantityUpdate}
              hasLoyaltyCard={hasLoyaltyCard}
            />
          ))}
        </div>

        <div className="flex flex-col gap-y-6 md:w-[255px] xl:w-[272px]">
          <BonusesSection
            bonusesCount={bonusesCount}
            useBonuses={useBonuses}
            onUseBonusesChange={setUseBonuses}
            totalPrice={totalPrice}
          />

          <CartSummary
            visibleCartItems={visibleCartItems}
            totalMaxPrice={totalMaxPrice}
            totalDiscount={totalDiscount}
            finalPrice={finalPrice}
            totalBonuses={totalBonuses}
            isMinimumReached={isMinimumReached}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
