"use client";

import { useActionState, useEffect } from "react";
import { createPriceAlert, PriceAlertFormState } from "@/actions/priceAlerts";

interface PriceAlertModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  productId: string;
  productTitle: string;
  currentPrice: string;
  onSuccessAction: (unsubscribeToken: string) => void;
}

export const PriceAlertModal = ({
  onCloseAction,
  productId,
  productTitle,
  currentPrice,
  onSuccessAction,
}: PriceAlertModalProps) => {
  const handleSubmit = async (
    prevState: PriceAlertFormState | null,
    formData: FormData,
  ): Promise<PriceAlertFormState> => {
    formData.append("productId", productId);
    formData.append("productTitle", productTitle);
    formData.append("currentPrice", currentPrice);

    return createPriceAlert(prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(
    handleSubmit,
    {} as PriceAlertFormState,
  );

  useEffect(() => {
    if (state?.success && state.unsubscribeToken) {
      onSuccessAction(state.unsubscribeToken);
      onCloseAction();
    }
  }, [state, onSuccessAction, onCloseAction]);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">
        Уведомление о снижении цены
      </h3>

      <form action={formAction} className="flex flex-col gap-3">
        <div>
          <input
            type="email"
            name="email"
            required
            placeholder="Ваш email"
            className={`p-2 rounded text-sm relative border border-primary shadow-button-default outline-0 w-full ${
              state?.errors?.email ? "border-[#d80000]" : ""
            }`}
            disabled={isPending}
          />
          {state?.errors?.email && (
            <p className="text-[#d80000] text-xs mt-1">{state.errors.email}</p>
          )}
        </div>

        {state?.errors?.general && (
          <p className="text-[#d80000] text-xs mt-1">{state.errors.general}</p>
        )}

        <div className="flex gap-2 text-sm">
          <button
            type="submit"
            disabled={isPending}
            className="justify-center flex-1 px-4 py-2 text-sm text-white rounded cursor-pointer bg-primary hover:shadow-button-default active:shadow-button-active disabled:opacity-50 disabled:cursor-not-allowed transition-custom"
          >
            {isPending ? "Подписка..." : "Подписаться"}
          </button>

          <button
            type="button"
            onClick={onCloseAction}
            disabled={isPending}
            className="px-4 py-2 justify-center items-center active:shadow-button-active border-none rounded cursor-pointer transition-custom bg-[#f3f2f1] hover:shadow-button-secondary disabled:opacity-50"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
