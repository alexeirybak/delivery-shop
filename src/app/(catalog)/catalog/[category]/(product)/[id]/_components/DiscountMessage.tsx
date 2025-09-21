"use client";

import { useState } from "react";
import { unsubscribePriceAlert } from "@/actions/priceAlerts";
import IconBell from "@/components/svg/IconBell";
import { PriceAlertModal } from "./PriceAlertModal";
import { useAuthStore } from "@/store/authStore";

interface DiscountMessageProps {
  productId: string;
  productTitle: string;
  currentPrice: number;
  initialIsSubscribed?: boolean;
  unsubscribeToken?: string;
}

const DiscountMessage = ({
  productId,
  productTitle,
  currentPrice,
  initialIsSubscribed = false,
  unsubscribeToken: initialUnsubscribeToken,
}: DiscountMessageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [unsubscribeToken, setUnsubscribeToken] = useState(
    initialUnsubscribeToken || ""
  );
  const [notification, setNotification] = useState("");
  const { isAuth } = useAuthStore();

  const handleOpenModal = () => {
    if (!isAuth) {
      setNotification("Подписка доступна только для авторизованных пользователей");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    if (isSubscribed) {
      setNotification("Вы уже подписаны на уведомления для этого товара");
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubscribeSuccess = (token: string) => {
    setIsSubscribed(true);
    setUnsubscribeToken(token);
    setNotification("Вы успешно подписались на уведомления!");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleUnsubscribe = async () => {
    if (!unsubscribeToken) return;

    setIsLoading(true);
    try {
      const result = await unsubscribePriceAlert(unsubscribeToken);

      if (result?.success) {
        setIsSubscribed(false);
        setNotification("Вы отписались от уведомлений");
        setTimeout(() => setNotification(""), 3000);
      } else if (result?.error) {
        setNotification(result.error);
        setTimeout(() => setNotification(""), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#008c48] text-white px-6 py-3 rounded shadow-md">
            {notification}
          </div>
        </div>
      )}

      {isSubscribed ? (
        <button
          onClick={handleUnsubscribe}
          disabled={isLoading}
          className="flex flex-row items-center gap-2 p-2 mb-6 text-[#606060] rounded text-xs hover:bg-gray-200 mx-auto duration-300 cursor-pointer"
        >
          <IconBell crossed={false} />
          {isLoading
            ? "Отписка..."
            : "Отписаться от уведомления о снижении цены"}
        </button>
      ) : (
        <button
          onClick={handleOpenModal}
          className="flex flex-row items-center gap-2 p-2 mb-6 text-[#606060] rounded text-xs hover:bg-gray-200 mx-auto duration-300 cursor-pointer"
        >
          <IconBell />
          Уведомить о снижении цены
        </button>
      )}

      <PriceAlertModal
        isOpen={isModalOpen}
        onCloseAction={handleCloseModal}
        productId={productId}
        productTitle={productTitle}
        currentPrice={currentPrice}
        onSuccessAction={handleSubscribeSuccess}
      />
    </>
  );
};

export default DiscountMessage;