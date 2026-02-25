"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { InputMask } from "@react-input/mask";
import {
  cleanCardNumber,
  isValidCardNumber,
  formatCardNumber,
} from "../../../../../../utils/validation/validProfileCard";
import { formStyles, profileStyles } from "@/app/styles";
import { AddCardFormProps } from "../types/cards.types";

export const AddCardForm = ({
  onSubmit,
  isSubmitting,
  error,
  success,
  onErrorChange,
  onSuccessChange,
}: AddCardFormProps) => {
  const [newCardNumber, setNewCardNumber] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = cleanCardNumber(value).slice(0, 16);
    setNewCardNumber(cleanValue);
    onErrorChange("");
    onSuccessChange("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidCardNumber(newCardNumber)) {
      onErrorChange("Номер карты должен содержать 16 цифр");
      return;
    }

    const cleanedCardNumber = cleanCardNumber(newCardNumber);
    await onSubmit(cleanedCardNumber);
    setNewCardNumber("");
  };

  const displayValue = formatCardNumber(newCardNumber, true);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Добавить новую карту</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={profileStyles.inputContainer}>
          <InputMask
            mask="____ ____ ____ ____"
            replacement={{ _: /\d/ }}
            value={displayValue}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            className={`${formStyles.input} [&&]:w-full`}
            disabled={isSubmitting}
          />
          <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm bg-green-50 p-2 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={profileStyles.saveButton}
        >
          {isSubmitting ? "Добавление..." : "Добавить карту"}
        </button>
      </form>
    </div>
  );
};
