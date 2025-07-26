"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import RegFormFooter from "../RegFormFooter";
import { validateRegisterForm } from "../../../../../utils/validation/form";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import VerificationMethodModal from "../VerificationMethodModal";
import { useFormContext } from "@/app/context/FormContext";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [invalidFormMessage, setInvalidFormMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { formData, setFormData, resetForm } = useFormContext();

  const handleClose = () => {
    resetForm();
    router.back();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    if (invalidFormMessage) {
      setInvalidFormMessage("");
    }

    if (id === "hasCard" && value === true) {
      setFormData({
        ...formData,
        hasCard: true,
        card: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleDateChange = (value: string) => {
    setFormData({
      ...formData,
      birthdayDate: value,
    });
  };

  const handleGenderChange = (gender: string) => {
    setFormData({
      ...formData,
      gender,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInvalidFormMessage("");

    try {
      const validation = validateRegisterForm(formData);
      if (!validation.isValid) {
        throw new Error(validation.errorMessage || "Невалидные данные формы");
      }

      // Форматируем данные, но сохраняем как строку
      const [day, month, year] = formData.birthdayDate.split(".");
      const isoDateString = (new Date(`${year}-${month}-${day}`)).toString();

      setFormData({
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
        birthdayDate: isoDateString, // Сохраняем как строку
      });

      setIsSuccess(true);
    } catch (err) {
      setError({
        error: err instanceof Error ? err : new Error("Ошибка регистрации"),
        userMessage: err instanceof Error ? err.message : "Неизвестная ошибка",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => validateRegisterForm(formData).isValid;

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  if (isSuccess && formData.email) {
    return <VerificationMethodModal />;
  }

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
          onSubmit={handleSubmit}
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

            <div className="flex flex-col gap-y-4 items-start">
              <DateInput
                value={formData.birthdayDate}
                onChangeAction={handleDateChange}
                id="birthdayDate"
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
                onChangeAction={handleGenderChange}
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

          {invalidFormMessage && (
            <div className="text-red-500 text-center my-4 p-4 bg-red-50 rounded">
              {invalidFormMessage}
            </div>
          )}

          <RegFormFooter isFormValid={isFormValid()} isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

// type RegistrationStep =
//   | "form"
//   | "phone-verification"
//   | "email-verification"
//   | "success";

// export default function RegisterPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<{
//     error: Error;
//     userMessage: string;
//   } | null>(null);
//   const [formData, setFormData] = useState(initialFormData);
//   const [showPassword, setShowPassword] = useState(false);
//   const [invalidFormMessage, setInvalidFormMessage] = useState("");
//   const [step, setStep] = useState<RegistrationStep>("form");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [verificationMethod, setVerificationMethod] = useState<"phone" | "email">("phone");
//   const router = useRouter();

//   const handleClose = () => {
//     setFormData(initialFormData);
//     router.back();
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { id, type } = e.target;
//     const value =
//       type === "checkbox"
//         ? (e.target as HTMLInputElement).checked
//         : e.target.value;

//     if (invalidFormMessage) {
//       setInvalidFormMessage("");
//     }

//     if (id === "hasCard" && value === true) {
//       setFormData((prev) => ({
//         ...prev,
//         hasCard: true,
//         card: "",
//       }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setInvalidFormMessage("");

//     const validation = validateRegisterForm(formData);
//     if (!validation.isValid) {
//       setInvalidFormMessage(
//         validation.errorMessage || "Заполните все обязательные поля корректно"
//       );
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // 1. Сохраняем пользователя в нашей БД
//       const userData = {
//         ...formData,
//         phone: formData.phone.replace(/\D/g, ""),
//       };

//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "Ошибка регистрации");
//       }

//       // 2. Инициируем верификацию
//       if (formData.phone) {
//         setVerificationMethod("phone");
//         await sendPhoneVerificationCode();
//         setStep("phone-verification");
//       } else if (formData.email) {
//         setVerificationMethod("email");
//         await sendEmailVerificationCode();
//         setStep("email-verification");
//       } else {
//         throw new Error("Не указан ни телефон, ни email для верификации");
//       }
//     } catch (error) {
//       setError({
//         error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
//         userMessage:
//           error instanceof Error
//             ? error.message
//             : "Ошибка регистрации. Попробуйте снова",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sendPhoneVerificationCode = async () => {
//     try {
//       const { error } = await authClient.phoneNumber.sendOtp({
//         phoneNumber: formData.phone.replace(/\D/g, ""),
//       });

//       if (error) throw error;
//     } catch (err) {
//       throw new Error("Не удалось отправить SMS. Попробуйте позже");
//     }
//   };

//   const sendEmailVerificationCode = async () => {
//     try {
//       // Здесь должна быть реализация отправки кода на email
//       // Например, вызов API вашего бэкенда
//       const res = await fetch("/api/send-email-verification", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "Ошибка отправки кода на email");
//       }
//     } catch (err) {
//       throw new Error("Не удалось отправить код на email. Попробуйте позже");
//     }
//   };

//   const handleVerificationSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (verificationMethod === "phone") {
//         const { error } = await authClient.phoneNumber.verify({
//           phoneNumber: formData.phone.replace(/\D/g, ""),
//           code: verificationCode,
//         });

//         if (error) throw error;
//       } else {
//         // Проверка кода для email
//         const res = await fetch("/api/verify-email-code", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: formData.email,
//             code: verificationCode,
//           }),
//         });

//         if (!res.ok) {
//           const data = await res.json();
//           throw new Error(data.error || "Неверный код подтверждения");
//         }
//       }

//       // Если верификация успешна, регистрируем в authClient
//       await authClient.signUp[verificationMethod === "phone" ? "phoneNumber" : "email"]({
//         [verificationMethod === "phone" ? "phoneNumber" : "email"]:
//           verificationMethod === "phone"
//             ? formData.phone.replace(/\D/g, "")
//             : formData.email,
//         name: formData.firstName,
//         password: formData.password,
//       });

//       setIsSuccess(true);
//       setStep("success");
//     } catch (error) {
//       setError({
//         error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
//         userMessage: "Неверный код подтверждения. Попробуйте снова",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = () => validateRegisterForm(formData).isValid;

//   if (isLoading) return <Loader />;
//   if (error)
//     return (
//       <ErrorComponent error={error.error} userMessage={error.userMessage} />
//     );

//   if (step === "success") return <SuccessModal email={formData.email} />;

//   if (step === "phone-verification" || step === "email-verification") {
//     return (
//       <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
//         <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-[687px] max-h-[100vh] overflow-y-auto">
//           <div className="flex justify-end">
//             <button
//               onClick={handleClose}
//               className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8"
//               aria-label="Закрыть"
//             >
//               <Image
//                 src="/icons-products/icon-closer.svg"
//                 width={24}
//                 height={24}
//                 alt="Закрыть"
//               />
//             </button>
//           </div>

//           <h1 className="text-2xl font-bold text-center mb-10">
//             Подтверждение {verificationMethod === "phone" ? "телефона" : "email"}
//           </h1>

//           <form
//             onSubmit={handleVerificationSubmit}
//             className="w-full max-w-[552px] mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
//           >
//             <div className="w-full flex flex-col items-center gap-y-4">
//               <p className="text-center mb-6">
//                 Код подтверждения отправлен на{" "}
//                 {verificationMethod === "phone"
//                   ? formData.phone
//                   : formData.email}
//               </p>

//               <input
//                 type="text"
//                 value={verificationCode}
//                 onChange={(e) => setVerificationCode(e.target.value)}
//                 placeholder="Введите код"
//                 className="border p-2 rounded w-full max-w-[200px] text-center"
//               />

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 mt-4"
//                 disabled={!verificationCode}
//               >
//                 Подтвердить
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   if (verificationMethod === "phone") {
//                     sendPhoneVerificationCode().catch(console.error);
//                   } else {
//                     sendEmailVerificationCode().catch(console.error);
//                   }
//                 }}
//                 className="text-blue-600 underline mt-2"
//               >
//                 Отправить код повторно
//               </button>

//               {verificationMethod === "phone" && formData.email && (
//                 <button
//                   type="button"
//                   onClick={async () => {
//                     try {
//                       setVerificationMethod("email");
//                       await sendEmailVerificationCode();
//                       setStep("email-verification");
//                     } catch (error) {
//                       setError({
//                         error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
//                         userMessage: "Не удалось отправить код на email",
//                       });
//                     }
//                   }}
//                   className="text-blue-600 underline mt-2"
//                 >
//                   Подтвердить через email вместо SMS
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
//       <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-[687px] max-h-[100vh] overflow-y-auto">
//         <div className="flex justify-end">
//           <button
//             onClick={handleClose}
//             className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8"
//             aria-label="Закрыть"
//           >
//             <Image
//               src="/icons-products/icon-closer.svg"
//               width={24}
//               height={24}
//               alt="Закрыть"
//             />
//           </button>
//         </div>

//         <h1 className="text-2xl font-bold text-center mb-10">Регистрация</h1>
//         <h2 className="text-lg font-bold text-center mb-6">
//           Обязательные поля
//         </h2>

//         <form
//           onSubmit={handleRegisterSubmit}
//           autoComplete="off"
//           className="w-full max-w-[552px] mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
//         >
//           <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
//             <div className="flex flex-col gap-y-4 items-start">
//               <PhoneInput
//                 value={formData.phone}
//                 onChangeAction={handleChange}
//               />
//               <PersonInput
//                 id="surname"
//                 label="Фамилия"
//                 value={formData.surname}
//                 onChange={handleChange}
//               />
//               <PersonInput
//                 id="firstName"
//                 label="Имя"
//                 value={formData.firstName}
//                 onChange={handleChange}
//               />
//               <PasswordInput
//                 id="password"
//                 label="Пароль"
//                 value={formData.password}
//                 onChangeAction={handleChange}
//                 showPassword={showPassword}
//                 togglePasswordVisibilityAction={() =>
//                   setShowPassword(!showPassword)
//                 }
//                 showRequirements={true}
//               />
//               <PasswordInput
//                 id="confirmPassword"
//                 label="Подтвердите пароль"
//                 value={formData.confirmPassword}
//                 onChangeAction={handleChange}
//                 showPassword={showPassword}
//                 togglePasswordVisibilityAction={() =>
//                   setShowPassword(!showPassword)
//                 }
//                 compareWith={formData.password}
//               />
//             </div>

//             <div className="flex flex-col gap-y-4 item-start">
//               <DateInput
//                 id="birthdayDate"
//                 value={formData.birthdayDate}
//                 onChangeAction={(value) =>
//                   setFormData((prev) => ({ ...prev, birthdayDate: value }))
//                 }
//               />

//               <SelectRegion
//                 value={formData.region}
//                 onChangeAction={handleChange}
//               />
//               <SelectCity
//                 value={formData.location}
//                 onChangeAction={handleChange}
//               />
//               <GenderSelect
//                 value={formData.gender}
//                 onChangeAction={(gender) =>
//                   setFormData((prev) => ({ ...prev, gender }))
//                 }
//               />
//             </div>
//           </div>
//           <h2 className="text-lg font-bold text-center mb-6 mt-10">
//             Необязательные поля
//           </h2>
//           <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
//             <div className="flex flex-col w-65 gap-y-4">
//               <CardInput
//                 value={formData.card}
//                 onChangeAction={handleChange}
//                 disabled={formData.hasCard}
//               />
//               <CheckboxCard
//                 checked={formData.hasCard}
//                 onChangeAction={handleChange}
//               />
//             </div>
//             <EmailInput value={formData.email} onChangeAction={handleChange} />
//           </div>
//           {invalidFormMessage && (
//             <div className="text-red-500 text-center my-4 p-4 bg-red-50 rounded">
//               {invalidFormMessage}
//             </div>
//           )}
//           <RegFormFooter isFormValid={isFormValid()} />
//         </form>
//       </div>
//     </div>
//   );
// }
