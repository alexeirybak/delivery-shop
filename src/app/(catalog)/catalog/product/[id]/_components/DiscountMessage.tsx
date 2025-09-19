"use client";

import { useState } from "react";
import { createPriceAlert, unsubscribePriceAlert } from "@/actions/priceAlerts";
import IconBell from "@/components/svg/IconBell";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";

interface DiscountMessageProps {
  productId: string;
  productTitle: string;
  currentPrice: number;
  initialIsSubscribed?: boolean;
  unsubscribeToken?: string;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const DiscountMessage = ({
  productId,
  productTitle,
  currentPrice,
  initialIsSubscribed = false,
  unsubscribeToken: initialUnsubscribeToken,
}: DiscountMessageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [unsubscribeToken, setUnsubscribeToken] = useState(
    initialUnsubscribeToken || ""
  );
  const [notification, setNotification] = useState("");

  const handleOpenModal = () => {
    if (isSubscribed) {
      setNotification("Вы уже подписаны на уведомления для этого товара");
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    setIsModalOpen(true);
    setEmailError("");
    setEmailValue("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmailError("");
    setEmailValue("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailValue(value);

    if (!value.trim()) {
      setEmailError("Email обязателен");
      return;
    }

    if (!isValidEmail(value)) {
      setEmailError("Введите корректный email");
      return;
    }

    setEmailError("");
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailValue.trim()) {
      setEmailError("Email обязателен");
      return;
    }

    if (!isValidEmail(emailValue)) {
      setEmailError("Введите корректный email");
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      const formData = new FormData();
      formData.append("email", emailValue);
      formData.append("productId", productId);
      formData.append("productTitle", productTitle);
      formData.append("currentPrice", currentPrice.toString());

      const result = await createPriceAlert(formData);

      if (result?.success) {
        setIsSubscribed(true);
        setUnsubscribeToken(result.unsubscribeToken || "");
        setIsModalOpen(false);
        setNotification("Вы успешно подписались на уведомления!");
        setTimeout(() => setNotification(""), 3000);
      } else if (result?.error) {
        setEmailError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!unsubscribeToken || !emailValue) return;

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

  const isEmailValid = emailValue.trim() && isValidEmail(emailValue);
  const isSubmitDisabled = isLoading || !isEmailValid;

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

      {isModalOpen && (
        <AuthFormLayout>
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Уведомление о снижении цены
            </h3>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Ваш email"
                  value={emailValue}
                  onChange={handleEmailChange}
                  className={`p-2 rounded text-sm relative border-1 border-primary shadow-button-default outline-0 w-full ${
                    emailError ? "border-[#d80000]" : ""
                  }`}
                  disabled={isLoading}
                />
                {emailError && (
                  <p className="text-[#d80000] text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div className="flex gap-2 text-sm">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="flex-1 justify-center px-4 py-2 text-white rounded text-sm bg-primary hover:shadow-button-default active:shadow-button-active disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer duration-300"
                >
                  {isLoading ? "Подписка..." : "Подписаться"}
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="px-4 py-2 justify-center items-center active:shadow-button-active border-none rounded cursor-pointer transition-colors duration-300 bg-[#f3f2f1] hover:shadow-button-secondary disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </AuthFormLayout>
      )}
    </>
  );
};

export default DiscountMessage;
