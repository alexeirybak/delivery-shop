"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
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

interface ActionState {
  success?: boolean;
  error?: string;
  unsubscribeToken?: string;
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
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (prevState: ActionState | null, formData: FormData): Promise<ActionState> => {
    const email = formData.get("email") as string;
    
    if (!email.trim()) {
      return { error: "Email обязателен" };
    }

    if (!isValidEmail(email)) {
      return { error: "Введите корректный email" };
    }

    formData.append("productId", productId);
    formData.append("productTitle", productTitle);
    formData.append("currentPrice", currentPrice.toString());

    return await createPriceAlert(formData);
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailValue(value);
    setEmailError(""); 
  };

  useEffect(() => {
    if (state?.success) {
      onSuccessAction(state.unsubscribeToken || "");
      onCloseAction();
    } else if (state?.error) {
      setEmailError(state.error);
    }
  }, [state, onSuccessAction, onCloseAction]);

  const isEmailValid = emailValue.trim() && isValidEmail(emailValue);
  const isSubmitDisabled = isPending || !isEmailValid;

  if (!isOpen) return null;

  return (
    <AuthFormLayout>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Уведомление о снижении цены
        </h3>

        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="productTitle" value={productTitle} />
          <input type="hidden" name="currentPrice" value={currentPrice.toString()} />
          
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
              disabled={isPending}
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
              {isPending ? "Подписка..." : "Подписаться"}
            </button>

            <button
              type="button"
              onClick={onCloseAction}
              disabled={isPending}
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