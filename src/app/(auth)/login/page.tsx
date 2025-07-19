"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputMask } from "@react-input/mask";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import Link from "next/link";
import IconVision from "@/components/svg/IconVision";

const labelStyles = "text-base text-[#8f8f8f] block";
const inputStyles =
  "w-65 h-10 py-2 px-4 text-[#414141] text-base border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none caret-(--color-primary)";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClearForm = () => {
    setFormData({
      phone: "+7",
      password: "",
    });
    router.back();
  };

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
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
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto">
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

        <h1 className="text-2xl font-bold text-center mb-10">Вход</h1>
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
                  showMask={false}
                  onFocus={(e) => {
                    if (e.target.value === "+7") {
                      e.target.setSelectionRange(2, 2);
                    }
                  }}
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
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!(formData.phone && formData.password)}
            className={`w-65 h-17 my-10 mx-auto text-2xl rounded cursor-pointer transition-all duration-200 ${
              formData.phone && formData.password
                ? "bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300"
                : "bg-[#fcd5ba] text-[#ff6633]"
            }`}
          >
            Вход
          </button>
          <div className="flex flex-row flex-wrap mb-10 mx-auto text-xs">
            <Link
              href="/register"
              className="h-8 text-(--color-primary) hover:text-white active:text-white border-1 border-(--color-primary) bg-white hover:bg-(--color-primary) active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300"
            >
              Регистрация
            </Link>
            <Link
              href="/forgotPassword"
              className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center duration-300"
            >
              Забыли пароль?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
