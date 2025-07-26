// app/context/FormContext.tsx
"use client"; // Важно: Context должен быть клиентским компонентом

import { createContext, useContext, useState, ReactNode } from "react";

// Типы для данных формы
interface FormData {
  phone: string;
  surname: string;
  firstName: string;
  password: string;
  confirmPassword: string;
  birthdayDate: string;
  region: string;
  location: string;
  gender: string;
  card: string;
  email: string;
  hasCard: boolean;
}

// Начальные значения
const initialFormData: FormData = {
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

// Тип контекста
type FormContextType = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  resetForm: () => void;
};

// Создаем контекст с начальными значениями
const FormContext = createContext<FormContextType>({
  formData: initialFormData,
  setFormData: () => {},
  resetForm: () => {},
});

// Провайдер контекста
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

// Хук для использования контекста
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};