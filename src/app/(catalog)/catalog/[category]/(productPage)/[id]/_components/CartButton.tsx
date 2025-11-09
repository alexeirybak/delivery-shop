"use client";

import { addToCartAction } from "@/actions/addToCartActions";
import Tooltip from "@/components/Tooltip";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useState } from "react";

const CartButton = ({ productId }: { productId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");

  const { fetchCart } = useCartStore();

  const showMessage = (message: string) => {
    setTooltipMessage(message);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowTooltip(false);

    try {
      const result = await addToCartAction(productId);
      if (result.success) {
        await fetchCart();
      } else if (result.message) {
        showMessage(result.message);
      }
    } catch {
      showMessage("Ошибка при добавлении в корзину");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative">
      {showTooltip && <Tooltip text={tooltipMessage} position="top" />}
      <form action={handleSubmit}>
        <button
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
    </div>
  );
};

export default CartButton;
