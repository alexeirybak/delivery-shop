"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getOrderCartAction,
  getUserBonusesAction,
  removeMultipleOrderItemsAction,
  updateOrderItemQuantityAction,
} from "@/actions/orderActions";
import { useCartStore } from "@/store/cartStore";
import { Loader } from "@/components/Loader";
import { ProductCardProps } from "@/types/product";
import CartHeader from "./_components/CartHeader";
import CartControls from "./_components/CartControls";
import CartItem from "./_components/CartItem";
import { usePricing } from "@/hooks/usePricing";
import CartSidebar from "./_components/CartSidebar";
import CheckoutForm from "./_components/CheckoutForm";
import { DeliveryAddress, DeliveryTime } from "@/types/order";

const CartPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<{
    [key: string]: ProductCardProps;
  }>({});
  const [bonusesCount, setBonusesCount] = useState<number>(0);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [title, setTitle] = useState<string>("Корзина");
  const [deliveryData, setDeliveryData] = useState<{
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null>(null);

  const handleFormDataChange = useCallback(
    (data: {
      address: DeliveryAddress;
      time: DeliveryTime;
      isValid: boolean;
    }) => {
      setDeliveryData(data);
    },
    []
  );

  const {
    cartItems,
    updateCart,
    hasLoyaltyCard,
    setHasLoyaltyCard,
    useBonuses,
    isCheckout,
    isOrdered,
  } = useCartStore();

  const sidebarProps = {
    deliveryData,
    productsData,
  };

  const visibleCartItems = cartItems.filter(
    (item) => !removedItems.includes(item.productId)
  );

  const availableCartItems = visibleCartItems.filter((item) => {
    const product = productsData[item.productId];
    return product && product.quantity > 0;
  });

  usePricing({
    availableCartItems,
    productsData,
    hasLoyaltyCard,
    bonusesCount,
    useBonuses,
  });

  const fetchCartAndProducts = async () => {
    setIsCartLoading(true);
    try {
      const userData = await getUserBonusesAction();
      setBonusesCount(userData.bonusesCount);
      setHasLoyaltyCard(userData.hasLoyaltyCard);

      const cartItems = await getOrderCartAction();

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

  useEffect(() => {
    setTitle(isCheckout ? "Доставка" : "Корзина");
  }, [isCheckout]);

  useEffect(() => {
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantityUpdate = useCallback(
    async (productId: string, newQuantity: number) => {
      const updatedCartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCartItems);

      try {
        await updateOrderItemQuantityAction(productId, newQuantity);
      } catch (error) {
        console.error("Ошибка обновления количества:", error);
        updateCart(cartItems);
      }
    },
    [cartItems, updateCart]
  );

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    setRemovedItems((prev) => [...prev, ...selectedItems]);

    const updatedCartItems = cartItems.filter(
      (item) => !selectedItems.includes(item.productId)
    );
    updateCart(updatedCartItems);

    try {
      removeMultipleOrderItemsAction(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error("Ошибка удаления товаров:", error);
      setRemovedItems((prev) =>
        prev.filter((id) => !selectedItems.includes(id))
      );
      updateCart(cartItems);
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
      <CartHeader itemCount={visibleCartItems.length} title={title} />

      <div className="flex flex-col md:flex-row gap-8 xl:gap-x-15">
        <div
          className={`flex-1 ${isOrdered ? "pointer-events-none opacity-50" : ""}`}
        >
          {!isCheckout ? (
            <>
              <CartControls
                isAllSelected={isAllSelected}
                selectedItemsCount={selectedItems.length}
                onSelectAll={selectAllItems}
                onDeselectAll={deselectAllItems}
                onRemoveSelected={handleRemoveSelected}
              />
              <div className="flex flex-col gap-y-6">
                {visibleCartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    productData={productsData[item.productId]}
                    isSelected={selectedItems.includes(item.productId)}
                    onSelectionChange={handleItemSelection}
                    onQuantityUpdate={handleQuantityUpdate}
                  />
                ))}
              </div>
            </>
          ) : (
            <CheckoutForm onFormDataChange={handleFormDataChange} />
          )}
        </div>

        <CartSidebar {...sidebarProps} />
      </div>
    </div>
  );
};

export default CartPage;
