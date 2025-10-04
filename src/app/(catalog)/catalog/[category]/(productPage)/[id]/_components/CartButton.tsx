"use client";

import { addToCartAction } from "@/actions/cartActions";
import CartActionMessage from "@/components/CartActionMessage";
import Image from "next/image";
import { useState } from "react";

const CartButton = ({ productId }: { productId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  console.log(productId);
  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await addToCartAction(productId);
      setMessage(result);
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
          className="mb-2 h-10 md:h-15 w-full bg-[#ff6633] text-white text-base md:text-2xl p-4 flex justify-center items-center rounded hover:shadow-article active:shadow-button-active duration-300 cursor-pointer relative"
        >
          <Image
            src="/icons-products/icon-shopping-cart.svg"
            alt="Корзина"
            width={32}
            height={32}
            className="absolute left-4"
          />
          <p className="text-center">В корзину</p>
        </button>
      </form>
      {message && (
        <CartActionMessage message={message} onClose={() => setMessage(null)} />
      )}
    </div>
  );
};

export default CartButton;
