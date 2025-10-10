"use client";

import { addToCartAction } from "@/actions/addToCartActions";
import { updateOrderItemQuantityAction } from "@/actions/orderActions";
import { useState } from "react";
import CartActionMessage from "./CartActionMessage";
import { useCartStore } from "@/store/cartStore";
import QuantitySelector from "@/app/(cart)/cart/_components/QuantitySelector";

const AddToCartButton = ({ productId }: { productId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const cartItems = useCartStore((state) => state.cartItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const updateCart = useCartStore((state) => state.updateCart);

  const cartItem = cartItems.find((item) => item.productId === productId);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity >= 0;

  const handleAddToCart = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await addToCartAction(productId);
      
      // Показываем сообщение только если это ошибка И сообщение не пустое
      if (!result.success && result.message) {
        setMessage(result);
      }
      
      if (result.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage({
        success: false,
        message: "Ошибка при добавлении в корзину",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityUpdate = async (newQuantity: number) => {
    if (newQuantity < 0 || isUpdating) return;

    setIsUpdating(true);

    try {
      let updatedCartItems;
      if (newQuantity === 0) {
        updatedCartItems = cartItems.filter(
          (item) => item.productId !== productId
        );
      } else {
        updatedCartItems = cartItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      updateCart(updatedCartItems);
      await updateOrderItemQuantityAction(productId, newQuantity);

      if (newQuantity === 0) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Ошибка обновления количества:", error);
      await fetchCart();
    } finally {
      setIsUpdating(false);
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
    <div className="px-2 pb-2">
      {isInCart ? (
        <div className="absolute flex justify-center bottom-2 left-2 right-2">
          <QuantitySelector
            quantity={currentQuantity}
            isUpdating={isUpdating}
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
          className="absolute border bottom-2 left-2 right-2 border-primary hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-button-active h-10 rounded justify-center items-center text-primary duration-300 cursor-pointer select-none disabled:opacity-50"
        >
          {isLoading ? "..." : "В корзину"}
        </button>
      )}
      {/* Показываем сообщение только если оно есть и это ошибка */}
      {message && message.message && (
        <CartActionMessage message={message} onClose={() => setMessage(null)} />
      )}
    </div>
  );
};

export default AddToCartButton;