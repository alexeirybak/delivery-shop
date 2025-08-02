"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Основной тип для регистрации (соответствует схеме better-auth)
interface RegistrationData {
  email: string;
  password: string;
  surname: string;
  name: string;
  birthdayDate: string;
  region: string;
  location: string;
  gender: string;
  card?: string;
  hasCard?: boolean;
}

// Расширенный тип для формы (включая дополнительные поля)
interface FormData extends RegistrationData {
  phone: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  phone: "+7",
  email: "",
  password: "",
  confirmPassword: "",
  surname: "",
  name: "",
  birthdayDate: "",
  region: "",
  location: "",
  gender: "",
  card: "",
  hasCard: false,
};

type FormContextType = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  resetForm: () => void;
};

const FormContext = createContext<FormContextType>({
  formData: initialFormData,
  setFormData: () => {},
  resetForm: () => {},
});

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

export const useFormContext = () => useContext(FormContext);
