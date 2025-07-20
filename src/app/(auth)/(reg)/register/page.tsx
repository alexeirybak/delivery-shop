"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import { validateRegisterForm } from "../../../../../utils/validation/form";
import RegFormFooter from "../RegFormFooter";
import PhoneInput from "../PhoneInput";
import PersonInput from "../PersonInput";
import PasswordInput from "../PasswordInput";
import DateInput from "../DateInput";
import SelectRegion from "../SelectRegion";
import SelectCity from "../SelectCity";
import GenderSelect from "../GenderSelect";
import CardInput from "../CardInput";
import CheckboxCard from "../CheckboxCard";
import EmailInput from "../EmailInput";
import SuccessModal from "../SuccessModal";

const initialFormData = {
  phone: "+7",
  surname: "",
  firstName: "",
  password: "",
  confirmPassword: "",
  birthdayDate: "",
  region: "",
  location: "",
  gender: "",
  card: "",
  email: "",
  hasCard: false,
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setFormData(initialFormData);
    router.back();
  };

  const handleDateInput = (value: string) => {
    setFormData((prev) => ({ ...prev, birthdayDate: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    if (id === "hasCard" && value === true) {
      setFormData((prev) => ({
        ...prev,
        hasCard: true,
        card: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const validation = validateRegisterForm(formData);

      if (!validation.isValid) {
        throw new Error(
          "Пожалуйста, заполните все обязательные поля корректно"
        );
      }

      const userData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка регистрации");
      }

      setIsSuccess(true);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage:
          error instanceof Error
            ? error.message
            : "Ошибка регистрации. Попробуйте снова",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return validateRegisterForm({
      ...formData,
      phone: formData.phone,
    }).isValid;
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  if (isSuccess) return <SuccessModal />;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-[687px] max-h-[100vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8"
            aria-label="Закрыть"
          >
            <Image
              src="/icons-products/icon-closer.svg"
              width={24}
              height={24}
              alt="Закрыть"
            />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center mb-10">Регистрация</h1>
        <h2 className="text-lg font-bold text-center mb-6">
          Обязательные поля
        </h2>

        <form
          onSubmit={onSubmit}
          autoComplete="off"
          className="w-full max-w-[552px] mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
        >
          <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex flex-col gap-y-4 items-start">
              <PhoneInput
                value={formData.phone}
                onChangeAction={handleChange}
              />
              <PersonInput
                id="surname"
                label="Фамилия"
                value={formData.surname}
                onChange={handleChange}
              />
              <PersonInput
                id="firstName"
                label="Имя"
                value={formData.firstName}
                onChange={handleChange}
              />
              <PasswordInput
                id="password"
                label="Пароль"
                value={formData.password}
                onChangeAction={handleChange}
                showPassword={showPassword}
                togglePasswordVisibilityAction={() =>
                  setShowPassword(!showPassword)
                }
                showRequirements={true}
              />
              <PasswordInput
                id="confirmPassword"
                label="Подтвердите пароль"
                value={formData.confirmPassword}
                onChangeAction={handleChange}
                showPassword={showPassword}
                togglePasswordVisibilityAction={() =>
                  setShowPassword(!showPassword)
                }
                compareWith={formData.password}
              />
            </div>

            <div className="flex flex-col gap-y-4 item-start">
              <DateInput
                value={formData.birthdayDate}
                onChangeAction={handleDateInput}
              />

              <SelectRegion
                value={formData.region}
                onChangeAction={handleChange}
              />
              <SelectCity
                value={formData.location}
                onChangeAction={handleChange}
              />
              <GenderSelect
                value={formData.gender}
                onChangeAction={(gender) =>
                  handleChange({
                    target: {
                      id: "gender",
                      value: gender,
                      type: "radio",
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-6 mt-10">
            Необязательные поля
          </h2>
          <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex flex-col w-65 gap-y-4">
              <CardInput
                value={formData.card}
                onChangeAction={handleChange}
                disabled={formData.hasCard}
              />
              <CheckboxCard
                checked={formData.hasCard}
                onChangeAction={handleChange}
              />
            </div>
            <EmailInput value={formData.email} onChangeAction={handleChange} />
          </div>

          <RegFormFooter isFormValid={isFormValid()} />
        </form>
      </div>
    </div>
  );
}
