"use client";

import { useState } from "react";
import { createPriceAlert } from "@/actions/priceAlerts";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";

interface PriceAlertModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  productId: string;
  productTitle: string;
  currentPrice: number;
  onSuccessAction: (unsubscribeToken: string) => void;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const PriceAlertModal = ({
  isOpen,
  onCloseAction,
  productId,
  productTitle,
  currentPrice,
  onSuccessAction,
}: PriceAlertModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailValue(value);

    if (!value.trim() && !isValidEmail(value)) {
      setEmailError("Введите корректный Email");
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
        onSuccessAction(result.unsubscribeToken || "");
        onCloseAction();
      } else if (result?.error) {
        setEmailError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = emailValue.trim() && isValidEmail(emailValue);
  const isSubmitDisabled = isLoading || !isEmailValid;

  if (!isOpen) return null;

  return (
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
              onClick={onCloseAction}
              disabled={isLoading}
              className="px-4 py-2 justify-center items-center active:shadow-button-active border-none rounded cursor-pointer transition-colors duration-300 bg-[#f3f2f1] hover:shadow-button-secondary disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </AuthFormLayout>
  );
};