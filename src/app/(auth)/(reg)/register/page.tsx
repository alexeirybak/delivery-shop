"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "../../_components/PhoneInput";
import PersonInput from "../_components/PersonInput";
import PasswordInput from "../../_components/PasswordInput";
import DateInput from "../_components/DateInput";
import SelectRegion from "../_components/SelectRegion";
import SelectCity from "../_components/SelectCity";
import GenderSelect from "../_components/GenderSelect";
import CardInput from "../_components/CardInput";
import CheckboxCard from "../_components/CheckboxCard";
import EmailInput from "../_components/EmailInput";
import RegFormFooter from "../_components/RegFormFooter";
import { validateRegisterForm } from "../../../../../utils/validation/form";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import VerificationMethodModal from "../../_components/VerificationMethodModal";
import { formatToISO } from "../../../../../utils/date/formatDate";
import { UserExistsError } from "../_components/UserExistsError";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { RegFormData } from "@/types/regFormData";
import { initialRegFormData } from "@/constants/formData";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [registerForm, setRegisterForm] = useState<RegFormData>(initialRegFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [invalidFormMessage, setInvalidFormMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [userExists, setUserExists] = useState<{
    phone?: boolean;
    email?: boolean;
  }>({});
  const router = useRouter();
  const { setRegFormData } = useRegFormContext();

  useEffect(() => {
    setRegisterForm(initialRegFormData);
  }, []);

  useEffect(() => {
    if (isSuccess && !registerForm.email) {
      router.replace("/verify/verify-phone");
    }
  }, [isSuccess, registerForm.email, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, type } = e.target;

    if (type === "checkbox") {
      setRegisterForm({
        ...registerForm,
        [id]: (e.target as HTMLInputElement).checked,
      });
    } else {
      let value = e.target.value;

      if (id === "phone") {
        value = value.replace(/\D/g, "");
        if (value.startsWith("8")) {
          value = "7" + value.substring(1);
        }
        value = value.substring(0, 11);
      }

      setRegisterForm({
        ...registerForm,
        [id]: value,
      });
    }
  };
  const checkUserExists = async () => {
    try {
      const checks = [];

      checks.push(
        fetch("/api/auth/check-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: registerForm.phone }),
        })
      );

      if (registerForm.email) {
        checks.push(
          fetch("/api/auth/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: registerForm.email }),
          })
        );
      }

      const responses = await Promise.all(checks);
      const results = await Promise.all(responses.map((r) => r.json()));

      const exists = {
        phone: results[0].exists,
        email: registerForm.email ? results[1]?.exists : false,
      };

      if (exists.phone || exists.email) {
        setUserExists(exists);
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInvalidFormMessage("");

    const validation = validateRegisterForm(registerForm);
    if (!validation.isValid) {
      setInvalidFormMessage(
        validation.errorMessage || "Заполните поля корректно"
      );
      setIsLoading(false);
      return;
    }

    try {
      const isUserAvailable = await checkUserExists();
      if (!isUserAvailable) {
        setIsLoading(false);
        return;
      }

      const apiData = {
        ...registerForm,
        phone: registerForm.phone.replace(/\D/g, ""),
        birthdayDate: formatToISO(registerForm.birthdayDate),
      };

      setRegFormData((prev) => {
        return {
          ...prev,
          ...apiData,
        } as RegFormData;
      });
      setIsSuccess(true);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Ошибка регистрации. Попробуйте снова",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  if (userExists.phone || userExists.email) {
    return (
      <UserExistsError
        phone={userExists.phone ? registerForm.phone : undefined}
        email={userExists.email ? registerForm.email : undefined}
      />
    );
  }

  if (isSuccess && registerForm.email) {
    return <VerificationMethodModal />;
  }

  return (
    <AuthFormLayout variant="register">
      <h1 className="text-2xl font-bold text-center mb-10">Регистрация</h1>
      <h2 className="text-lg font-bold text-center mb-6">Обязательные поля</h2>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-[552px] mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
      >
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 text-left">
          <div className="flex flex-col gap-y-4 items-start">
            <PhoneInput
              value={registerForm.phone}
              onChangeAction={handleChange}
            />
            <PersonInput
              id="surname"
              label="Фамилия"
              value={registerForm.surname}
              onChange={handleChange}
            />
            <PersonInput
              id="name"
              label="Имя"
              value={registerForm.name}
              onChange={handleChange}
            />
            <PasswordInput
              id="password"
              label="Пароль"
              value={registerForm.password}
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
              value={registerForm.confirmPassword}
              onChangeAction={handleChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
              compareWith={registerForm.password}
            />
          </div>

          <div className="flex flex-col gap-y-4 items-start">
            <DateInput
              value={registerForm.birthdayDate}
              onChangeAction={(value) =>
                setRegisterForm((prev) => ({ ...prev, birthdayDate: value }))
              }
            />
            <SelectRegion
              value={registerForm.region}
              onChangeAction={handleChange}
            />
            <SelectCity
              value={registerForm.location}
              onChangeAction={handleChange}
            />
            <GenderSelect
              value={registerForm.gender}
              onChangeAction={(gender) =>
                setRegisterForm((prev) => ({ ...prev, gender }))
              }
            />
          </div>
        </div>

        <h2 className="text-lg font-bold text-center mb-6 mt-10">
          Необязательные поля
        </h2>
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 text-left">
          <div className="flex flex-col w-65 gap-y-4">
            <CardInput
              value={registerForm.card}
              onChangeAction={handleChange}
              disabled={registerForm.hasCard}
            />
            <CheckboxCard
              checked={registerForm.hasCard}
              onChangeAction={handleChange}
            />
          </div>
          <EmailInput
            value={registerForm.email}
            onChangeAction={handleChange}
          />
        </div>

        {invalidFormMessage && (
          <div className="text-red-500 text-center my-4 p-4 bg-red-50 rounded">
            {invalidFormMessage}
          </div>
        )}

        <RegFormFooter
          isFormValid={validateRegisterForm(registerForm).isValid}
          isLoading={isLoading}
        />
      </form>
    </AuthFormLayout>
  );
};

export default RegisterPage;
