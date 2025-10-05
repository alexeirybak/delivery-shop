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
  updateOrderItemQuantityAction,
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<{
    [key: string]: ProductCardProps;
  }>({});
  const [bonusesCount, setBonusesCount] = useState<number>(0);
  const [hasLoyaltyCard, setHasLoyaltyCard] = useState<boolean>(false);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [useBonuses, setUseBonuses] = useState<boolean>(false);
  const { cartItems, updateCart } = useCartStore();

  // Фильтруем удаленные товары
  const visibleCartItems = cartItems.filter(
    (item) => !removedItems.includes(item.productId)
  );

  useEffect(() => {
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCartAndProducts = async () => {
    setIsCartLoading(true);
    try {
      // Получаем данные пользователя (бонусы и карту)
      const userData = await getUserBonusesAction();
      setBonusesCount(userData.bonusesCount);
      setHasLoyaltyCard(userData.hasLoyaltyCard);

      const cartItems = await getOrderCartAction();

      // ОБНОВЛЯЕМ STORE данными из сервера
      updateCart(cartItems);

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

      const productsResults = await Promise.all(productPromises);
      const productsMap: { [key: string]: ProductCardProps } = {};

      productsResults.forEach((result) => {
        if (result && result.product) {
          productsMap[result.productId] = result.product;
        }
      });

      setProductsData(productsMap);
    } catch (error) {
      console.error("Ошибка получения данных корзины:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleQuantityUpdate = useCallback(
    async (productId: string, newQuantity: number) => {
      // Оптимистичное обновление store
      const updatedCartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCartItems);

      try {
        await updateOrderItemQuantityAction(productId, newQuantity);
      } catch (error) {
        console.error("Ошибка обновления количества:", error);
        // Откат к предыдущему состоянию
        updateCart(cartItems);
      }
    },
    [cartItems, updateCart]
  );

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    // СРАЗУ убираем товары из рендеринга
    setRemovedItems((prev) => [...prev, ...selectedItems]);

    const updatedCartItems = cartItems.filter(
      (item) => !selectedItems.includes(item.productId)
    );
    updateCart(updatedCartItems);

    try {
      // Удаляем в фоне - НЕ ЖДЕМ ОТВЕТА
      removeMultipleOrderItemsAction(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error("Ошибка удаления товаров:", error);
      setRemovedItems((prev) =>
        prev.filter((id) => !selectedItems.includes(id))
      );
      updateCart(cartItems); // Восстанавливаем предыдущее состояние
    }
  };

  const selectAllItems = () => {
    setSelectedItems(visibleCartItems.map((item) => item.productId));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const handleItemSelection = useCallback(
    (productId: string, isSelected: boolean) => {
      if (isSelected) {
        setSelectedItems((prev) => [...prev, productId]);
      } else {
        setSelectedItems((prev) => prev.filter((id) => id !== productId));
      }
    },
    []
  );

  // Расчет общей стоимости ВСЕХ товаров в корзине (независимо от чекбоксов)
  const totalPrice = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    // Применяем скидку по карте лояльности, если у пользователя есть карта
    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
      : priceWithDiscount;

    return total + finalPrice * item.quantity;
  }, 0);

  // Расчет общей максимальной цены (базовые цены без скидок)
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

  const maxBonusUse = Math.min(bonusesCount, Math.floor(totalPrice * 0.3));
  const finalPrice = useBonuses
    ? Math.max(0, totalPrice - maxBonusUse)
    : totalPrice;

  const totalBonuses = visibleCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );
    const bonuses = priceWithDiscount * (CONFIG.BONUSES_PERCENT / 100);

    return total + Math.round(bonuses) * item.quantity;
  }, 0);

  const isMinimumReached = finalPrice >= 1000;

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
