"use client";

import { addToCartAction } from "@/actions/addToCartActions";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import {
  removeMultipleOrderItemsAction,
  updateOrderItemQuantityAction,
} from "@/actions/orderActions";
import QuantitySelector from "@/app/(cart)/cart/_components/QuantitySelector";
import Tooltip from "@/components/Tooltip";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  availableQuantity: number;
  status?: "out-of-stock" | "low-stock";
}

const AddToCartButton = ({
  productId,
  disabled = false,
  availableQuantity,
  status,
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");

  const { cartItems, updateCart, fetchCart } = useCartStore();

  const cartItem = cartItems.find((item) => item.productId === productId);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;
  const displayQuantity = Math.min(currentQuantity, availableQuantity);

  const hasReachedMaxQuantity = displayQuantity >= availableQuantity;
  const isOutOfStock = status === "out-of-stock" || availableQuantity === 0;

  const showMessage = (message: string) => {
    // if (tooltipMessage === message && showTooltip) return;

    setTooltipMessage(message);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  const handleAddToCart = async () => {
    if (hasReachedMaxQuantity) {
      showMessage(`Осталось ${availableQuantity} шт. этого товара`);
      return;
    }

    setIsLoading(true);
    setShowTooltip(false);

    try {
      const result = await addToCartAction(productId);

      if (!result.success && result.message) {
        showMessage(result.message);
      }

      if (result.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Ошибка добавления товара в корзину:", error);
      showMessage("Ошибка при добавлении в корзину");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityUpdate = async (newQuantity: number) => {
    if (newQuantity < 0 || isLoading) return;

    if (newQuantity > availableQuantity) {
      showMessage(`Осталось ${availableQuantity} шт. этого товара`);
      return;
    }

    setIsLoading(true);
    setShowTooltip(false);

    try {
      let updatedCartItems;
      if (newQuantity === 0) {
        updatedCartItems = cartItems.filter(
          (item) => item.productId !== productId
        );
        updateCart(updatedCartItems);
        await removeMultipleOrderItemsAction([productId]);
      } else {
        updatedCartItems = cartItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
        updateCart(updatedCartItems);
        await updateOrderItemQuantityAction(productId, newQuantity);
      }

      await fetchCart();
    } catch (error) {
      console.error("Ошибка обновления количества:", error);
      showMessage("Ошибка при обновлении количества");
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(0, displayQuantity - 1);
    handleQuantityUpdate(newQuantity);
  };

  const handleIncrement = () => {
    if (hasReachedMaxQuantity) {
      showMessage(`Осталось ${availableQuantity} шт. этого товара`);
      return;
    }
    handleQuantityUpdate(displayQuantity + 1);
  };

  const getButtonText = () => {
    if (isOutOfStock) {
      return "Нет в наличии";
    }
    if (disabled) {
      return isOutOfStock ? "Нет в наличии" : "Количество ограничено";
    }
    if (isLoading) {
      return "...";
    }
    return "В корзину";
  };

  return (
    <div className="relative">
      {showTooltip && (
        <Tooltip text={tooltipMessage} position="top" cardPosition={true} />
      )}

      {isInCart && !isOutOfStock ? (
        <div className="absolute flex justify-center bottom-2 left-2 right-2">
          <QuantitySelector
            quantity={displayQuantity} // Всегда показываем корректное количество!
            isUpdating={isLoading}
            isOutOfStock={isOutOfStock}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
            onProductCard={true}
          />
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={
            isOutOfStock || disabled || isLoading || hasReachedMaxQuantity
          }
          className={`absolute border bottom-2 left-2 right-2 h-10 rounded justify-center items-center duration-300 select-none ${
            isOutOfStock || disabled || hasReachedMaxQuantity
              ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
              : "border-primary text-primary hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) cursor-pointer"
          }`}
        >
          {getButtonText()}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
