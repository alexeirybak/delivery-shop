"use client";

import { addToCartAction } from "@/actions/addToCartActions";
import { useState } from "react";
import CartActionMessage from "./CartActionMessage";
import { useCartStore } from "@/store/cartStore";
import {
  removeMultipleOrderItemsAction,
  updateOrderItemQuantityAction,
} from "@/actions/orderActions";
import QuantitySelector from "@/app/(cart)/cart/_components/QuantitySelector";

const AddToCartButton = ({ productId }: { productId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { cartItems, updateCart, fetchCart } = useCartStore();

  const cartItem = cartItems.find((item) => item.productId === productId);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;

  const handleAddToCart = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await addToCartAction(productId);

      if (!result.success && result.message) {
        setMessage(result);
      }

      if (result.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Ошибка добавления товара в корзину:", error);
      setMessage({
        success: false,
        message: "Ошибка при добавлении в корзину",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityUpdate = async (newQuantity: number) => {
    if (newQuantity < 0 || isLoading) return;

    setIsLoading(true);

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
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(0, currentQuantity - 1);
    handleQuantityUpdate(newQuantity);
  };

  const handleIncrement = () => {
    handleQuantityUpdate(currentQuantity + 1);
  };

  return (
    <div className="relative">
      {isInCart ? (
        <div className="absolute flex justify-center bottom-2 left-2 right-2">
          <QuantitySelector
            quantity={currentQuantity}
            isUpdating={isLoading}
            isOutOfStock={false}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
            onProductCard={true}
          />
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="absolute border bottom-2 left-2 right-2 border-primary hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center text-primary transition-all duration-300 cursor-pointer select-none"
        >
          {isLoading ? "..." : "В корзину"}
        </button>
      )}

      {message && (
        <CartActionMessage message={message} onClose={() => setMessage(null)} />
      )}
    </div>
  );
};

export default AddToCartButton;
