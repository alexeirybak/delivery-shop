"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { InputMask } from "@react-input/mask";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import Link from "next/link";
import IconVision from "@/components/svg/IconVision";

const labelStyles = "text-base text-[#8f8f8f] block";
const inputStyles =
  "w-65 h-10 py-2 px-4 text-[#414141] text-base border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none caret-(--color-primary)";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
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
  });

  const [date, setDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleClearForm = () => {
    setFormData({
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
    });
    setDate("");
    router.back();
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Очищаем ввод от всего, кроме цифр
    const cleanValue = e.target.value.replace(/\D/g, "");

    // Форматируем в дд.мм.гггг
    let formattedValue = "";
    if (cleanValue.length > 0) {
      formattedValue = cleanValue.slice(0, 2);
    }
    if (cleanValue.length > 2) {
      formattedValue += "." + cleanValue.slice(2, 4);
    }
    if (cleanValue.length > 4) {
      formattedValue += "." + cleanValue.slice(4, 8);
    }

    setDate(formattedValue);
  };

  const handleCalendarClick = () => {
    // Создаем временный input типа date
    const tempInput = document.createElement("input");
    tempInput.type = "date";
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";

    tempInput.onchange = () => {
      if (tempInput.value) {
        const [year, month, day] = tempInput.value.split("-");
        setDate(`${day}.${month}.${year}`);
      }
      document.body.removeChild(tempInput);
    };

    document.body.appendChild(tempInput);
    tempInput.showPicker();
  };

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    // Если меняется чекбокс "Нет карты" и он активируется
    if (id === "hasCard" && value === true) {
      setFormData((prev) => ({
        ...prev,
        hasCard: true, // Устанавливаем флаг
        card: "", // Очищаем поле карты
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.password || formData.password.length < 5) {
        throw new Error("Пароль должен содержать минимум 6 символов");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Пароли не совпадают");
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/dashboard");
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

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-[687px] max-h-[100vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={handleClearForm} // Используем функцию очистки
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
              <div>
                <label htmlFor="phone" className={labelStyles}>
                  Телефон
                </label>
                <InputMask
                  mask="+7 (___) ___-__-__"
                  replacement={{ _: /\d/ }}
                  id="phone"
                  type="text"
                  value={formData.phone}
                  placeholder="+7 (___) ___-__-__"
                  onChange={handleChange}
                  className={inputStyles}
                  showMask={false} // Скрыть маску при вводе
                  onFocus={(e) => {
                    // Автоматически устанавливаем курсор после +7
                    if (e.target.value === "+7") {
                      e.target.setSelectionRange(2, 2);
                    }
                  }}
                />
              </div>

              <div>
                <label htmlFor="surname" className={labelStyles}>
                  Фамилия
                </label>
                <input
                  id="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>

              <div>
                <label htmlFor="firstName" className={labelStyles}>
                  Имя
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelStyles}>
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={inputStyles}
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute("readOnly")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <IconVision showPassword={showPassword} />
                  </button>

                  {/* Тултип с требованиями */}
                  {formData.password &&
                    !(
                      formData.password.length > 5 &&
                      /[a-z]/.test(formData.password) &&
                      /[A-Z]/.test(formData.password) &&
                      /\d/.test(formData.password)
                    ) && (
                      <div className="absolute left-0 top-full mt-1 w-full transition-all duration-300 ease-in-out">
                        <div className="relative bg-[#d80000] text-white text-sm p-2 rounded max-w-65 mx-auto flex items-center z-50 opacity-0 animate-fadeIn">
                          <Image
                            src="/icons-auth/icon-attention.svg"
                            width={21}
                            height={21}
                            alt="Внимание!"
                            className="mr-4"
                          />
                          {/* Треугольный выступ ВНИЗ (12px основание, 4px высота) */}
                          <div
                            className="absolute left-1/2 -top-1 transform -translate-x-1/2 w-0 h-0 
                       border-l-[6px] border-r-[6px] border-b-[4px] 
                       border-l-transparent border-r-transparent border-b-[#d80000]"
                          ></div>
                          Пароль должен содержать: 6+ символов, буквы (A-Z, a-z)
                          и цифры
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className={labelStyles}>
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputStyles}
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute("readOnly")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <IconVision showPassword={showPassword} />
                  </button>
                </div>

                {/* Тултип с треугольным выступом сверху */}
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <div className="absolute left-0 top-full mt-1 w-full transition-all duration-300 ease-in-out">
                      <div className="relative bg-[#d80000] text-white text-sm p-2 rounded max-w-65 mx-auto flex items-center z-50 opacity-0 animate-fadeIn">
                        <Image
                          src="/icons-auth/icon-attention.svg"
                          alt="Пароли пока не совпадают"
                          width={21}
                          height={21}
                          className="mr-4"
                        />
                        {/* Треугольный выступ (12px основание, 4px высота) */}
                        <div
                          className="absolute left-1/2 -top-1 transform -translate-x-1/2 w-0 h-0 
                       border-l-[6px] border-r-[6px] border-b-[4px] 
                       border-l-transparent border-r-transparent border-b-[#d80000]"
                        ></div>
                        Пароли пока не совпадают
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex flex-col gap-y-4 item-start">
              <div className="relative">
                <label className={labelStyles}>Дата рождения</label>
                <div className="relative">
                  <input
                    ref={dateInputRef}
                    type="text"
                    value={date}
                    onChange={handleDateInput}
                    placeholder="дд.мм.гггг"
                    className={`${inputStyles} pr-8`}
                    maxLength={10}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={handleCalendarClick}
                  >
                    <Image
                      src="/icons-auth/icon-date.svg"
                      width={20}
                      height={20}
                      alt="Выбрать дату"
                    />
                  </button>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="region" className={labelStyles}>
                  Регион
                </label>
                <div className="relative">
                  <select
                    id="region"
                    value={formData.region}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none pr-8 cursor-pointer`}
                  >
                    <option value="">Выберите регион</option>
                    <option value="Архангельская">Архангельская область</option>
                    <option value="Вологодская">Вологодская область</option>
                    <option value="Кировская">Кировская область</option>
                    <option value="Коми">Республика Коми</option>
                    <option value="Карелия">Республика Карелия</option>
                    <option value="НАО">Ненецкий автономный округ</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Image
                      src="/icons-products/icon-arrow-right.svg"
                      width={24}
                      height={24}
                      alt="Выберите регион"
                      className="rotate-90"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="location" className={labelStyles}>
                  Населенный пункт
                </label>
                <div className="relative">
                  <select
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none pr-8 cursor-pointer`}
                  >
                    <option value="">Выберите город</option>
                    <option value="Архангельск">Архангельск</option>
                    <option value="Северодвинск">Северодвинск</option>
                    <option value="Новодвинск">Новодвинск</option>
                    <option value="Котлас">Котлас</option>
                    <option value="Коряжма">Коряжма</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Image
                      src="/icons-products/icon-arrow-right.svg"
                      width={24}
                      height={24}
                      alt="Выберите город"
                      className="rotate-90"
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs">
                <label className={labelStyles}>Пол</label>
                <div className="flex gap-1 bg-[#f3f2f1] h-10 rounded p-1">
                  <button
                    type="button"
                    onClick={() => handleGenderChange("male")}
                    className={`flex-1 rounded duration-300 cursor-pointer ${
                      formData.gender === "male"
                        ? "bg-(--color-primary) text-white"
                        : ""
                    }`}
                  >
                    Мужской
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderChange("female")}
                    className={`flex-1 rounded duration-300 cursor-pointer ${
                      formData.gender === "female"
                        ? "bg-(--color-primary) text-white"
                        : ""
                    }`}
                  >
                    Женский
                  </button>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-6 mt-10">
            Необязательные поля
          </h2>
          <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex flex-col w-65 gap-y-4">
              <div className="flex flex-col">
                <label htmlFor="card" className={labelStyles}>
                  Номер карты
                </label>
                <InputMask
                  mask="____ ____ ____ ____"
                  replacement={{ _: /\d/ }}
                  id="card"
                  value={formData.card}
                  onChange={handleChange}
                  disabled={formData.hasCard}
                  className={`${inputStyles} ${
                    formData.hasCard ? "bg-[#f3f2f1] cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    id="hasCard"
                    type="checkbox"
                    checked={formData.hasCard}
                    onChange={handleChange}
                    className="absolute opacity-0 h-0 w-0"
                  />
                  <span
                    className={`relative w-5 h-5 border rounded flex items-center justify-center transition-colors
                      ${
                        formData.hasCard
                          ? "bg-[#70c05b] border-[#70c05b]"
                          : "bg-white border-[#bfbfbf]"
                      }`}
                  >
                    {formData.hasCard && (
                      <Image
                        src="/icons-auth/icon-has.svg"
                        width={12}
                        height={12}
                        alt="Checked"
                        className="text-white"
                      />
                    )}
                  </span>
                  <span className="ml-2 text-[#8f8f8f]">
                    У меня нет карты лояльности
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelStyles}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              !(
                formData.phone &&
                formData.surname &&
                formData.firstName &&
                formData.password &&
                formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                formData.region &&
                formData.location &&
                formData.gender
              )
            }
            className={`w-65 h-17 my-10 mx-auto text-2xl rounded cursor-pointer transition-all duration-200 ${
              formData.phone &&
              formData.surname &&
              formData.firstName &&
              formData.password &&
              formData.confirmPassword &&
              formData.password === formData.confirmPassword &&
              formData.region &&
              formData.location &&
              formData.gender
                ? "bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300"
                : "bg-[#fcd5ba] text-[#ff6633]"
            }`}
          >
            Продолжить
          </button>
          <Link
            href="/login"
            className="mb-10 mx-auto h-8 text-(--color-primary) hover:text-white active:text-white border-1 border-(--color-primary) bg-white hover:bg-(--color-primary) active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300"
          >
            Вход
          </Link>
        </form>
      </div>
    </div>
  );
}
