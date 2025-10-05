"use client";

import { useEffect, useState, useCallback } from "react";
import CartItem from "./_components/CartItem";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../../../utils/calcPrices";
import {
  getOrderCartAction,
  getUserBonusesAction,
  removeMultipleOrderItemsAction,
} from "@/actions/orderActions";
import { useCartStore } from "@/store/cartStore";
import { Loader } from "@/components/Loader";
import { ProductCardProps } from "@/types/product";
import { CONFIG } from "../../../../config/config";
import CartHeader from "./_components/CartHeader";
import CartControls from "./_components/CartControls";
import CartSummary from "./_components/CartSummary";
import BonusesSection from "./_components/BonusesSection";

const CartPage = () => {
  // Состояние для отслеживания выбранных товаров (массив ID)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Состояние для хранения данных о товарах (объект с ключами - ID товаров)
  const [productsData, setProductsData] = useState<{
    [key: string]: ProductCardProps;
  }>({});

  // Состояние для количества доступных бонусов
  const [bonusesCount, setBonusesCount] = useState<number>(0);

  // Состояние, указывающее есть ли у пользователя карта лояльности
  const [hasLoyaltyCard, setHasLoyaltyCard] = useState<boolean>(false);

  // Состояние для отслеживания удаленных товаров (чтобы скрыть их из интерфейса)
  const [removedItems, setRemovedItems] = useState<string[]>([]);

  // Состояние загрузки данных корзины
  const [isCartLoading, setIsCartLoading] = useState(true);

  // Флаг использования бонусов для оплаты
  const [useBonuses, setUseBonuses] = useState<boolean>(false);

  // Получение данных корзины из глобального состояния (Zustand store)
  const { cartItems, updateCart } = useCartStore();

  // Фильтруем удаленные товары - показываем только те, что не в списке удаленных
  const visibleCartItems = cartItems.filter(
    (item) => !removedItems.includes(item.productId)
  );

  // Эффект для загрузки данных при монтировании компонента
  useEffect(() => {
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Асинхронная функция загрузки данных корзины и товаров
  const fetchCartAndProducts = async () => {
    setIsCartLoading(true); // Включаем индикатор загрузки
    try {
      // Получаем данные пользователя (бонусы и карту)
      const userData = await getUserBonusesAction();
      setBonusesCount(userData.bonusesCount);
      setHasLoyaltyCard(userData.hasLoyaltyCard);

      // Загружаем актуальные данные корзины с сервера
      const cartItems = await getOrderCartAction();

      // ОБНОВЛЯЕМ STORE данными из сервера
      updateCart(cartItems);

      // Создаем массив промисов для параллельной загрузки данных о каждом товаре
      const productPromises = cartItems.map(async (item) => {
        try {
          const response = await fetch(`/api/products/${item.productId}`);
          const product = await response.json();
          return { productId: item.productId, product };
        } catch (error) {
          console.error(`Ошибка получения продукта ${item.productId}:`, error);
          return null;
        }
      });

      // Ожидаем завершения всех запросов к API товаров
      const productsResults = await Promise.all(productPromises);
      const productsMap: { [key: string]: ProductCardProps } = {};

      // Преобразуем массив результатов в объект для быстрого доступа по ID
      productsResults.forEach((result) => {
        if (result && result.product) {
          productsMap[result.productId] = result.product;
        }
      });

      setProductsData(productsMap);
    } catch (error) {
      console.error("Ошибка получения данных корзины:", error);
    } finally {
      setIsCartLoading(false); // Выключаем индикатор загрузки в любом случае
    }
  };

  // Функция обновления количества товара (мемоизирована для оптимизации)
  const handleQuantityUpdate = useCallback(
    (productId: string, newQuantity: number) => {
      // Создаем обновленный массив товаров с измененным количеством
      const updatedCartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCartItems); // Обновляем глобальное состояние
    },
    [cartItems, updateCart] // Зависимости для useCallback
  );

  // Функция удаления выбранных товаров
  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    // СРАЗУ убираем товары из рендеринга (оптимистичное обновление UI)
    setRemovedItems((prev) => [...prev, ...selectedItems]);

    try {
      // Удаляем в фоне - НЕ ЖДЕМ ОТВЕТА (неблокирующий запрос)
      removeMultipleOrderItemsAction(selectedItems);
      setSelectedItems([]); // Очищаем выбранные товары
    } catch (error) {
      console.error("Ошибка удаления товаров:", error);
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

  // Обработчик выбора/снятия выбора отдельного товара (мемоизирован)
  const handleItemSelection = useCallback(
    (productId: string, isSelected: boolean) => {
      if (isSelected) {
        setSelectedItems((prev) => [...prev, productId]); // Добавляем к выбранным
      } else {
        setSelectedItems((prev) => prev.filter((id) => id !== productId)); // Удаляем из выбранных
      }
    },
    [] // Нет зависимостей - функция стабильна
  );

  // Расчет общей стоимости ВСЕХ товаров в корзине (независимо от чекбоксов)
  const totalPrice = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

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

  // Расчет общей максимальной цены (базовые цены без скидок по карте)
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

  // Максимальное количество бонусов, которые можно использовать (не более 30% от суммы)
  const maxBonusUse = Math.min(bonusesCount, Math.floor(totalPrice * 0.3));

  // Итоговая цена с учетом использованных бонусов (не может быть отрицательной)
  const finalPrice = useBonuses
    ? Math.max(0, totalPrice - maxBonusUse)
    : totalPrice;

  // Расчет общего количества бонусов, которые будут начислены за покупку
  const totalBonuses = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );
    // Начисляем бонусы в процентах от цены товара
    const bonuses = priceWithDiscount * (CONFIG.BONUSES_PERCENT / 100);

    return total + Math.round(bonuses) * item.quantity; // Округляем и умножаем на количество
  }, 0);

  // Проверка достижения минимальной суммы заказа (1000 рублей)
  const isMinimumReached = finalPrice >= 1000;

  // Проверка, выбраны ли все товары в корзине
  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === visibleCartItems.length;

  // Показываем индикатор загрузки пока данные грузятся
  if (isCartLoading) {
    return <Loader />;
  }

  // Показываем сообщение о пустой корзине, если товаров нет и ничего не удалялось
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
    <div className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] text-main-text">
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
