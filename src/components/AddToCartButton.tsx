"use client";

import { addToCartAction } from "@/actions/addToCartActions";
import { useState } from "react";
import CartActionMessage from "./CartActionMessage";
import { useCartStore } from "@/store/cartStore";

const AddToCartButton = ({ productId }: { productId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { fetchCart } = useCartStore();

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await addToCartAction(productId);
      setMessage(result);
      if (result.success) {
        await fetchCart();
      }
    } catch {
      setMessage({
        success: false,
        message: "Ошибка при добавлении в корзину",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative">
      <form action={handleSubmit}>
        <button
          type="submit"
          disabled={isLoading}
          className="absolute border bottom-2 left-2 right-2 border-primary hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center text-primary transition-all duration-300 cursor-pointer select-none"
        >
          В корзину
        </button>
      </form>
      {message && (
        <CartActionMessage message={message} onClose={() => setMessage(null)} />
      )}
    </div>
  );
};

export default AddToCartButton;
