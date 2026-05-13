"use client";

import { createContext, useContext, useState } from "react";

interface RegFormData {
  email: string;
  password: string;
  name: string;
  status: string;
  country?: string;
  organization?: string;
  specialization?: string;
  interests?: string;
  termsAccepted: boolean;
  hasPassword: boolean;
}

interface RegFormContextType {
  regFormData: RegFormData;
  setRegFormData: (data: RegFormData) => void;
}

const RegFormContext = createContext<RegFormContextType | undefined>(undefined);

export function RegFormProvider({ children }: { children: React.ReactNode }) {
  const [regFormData, setRegFormData] = useState<RegFormData>({
    email: "",
    password: "",
    name: "",
    status: "",
    country: "",
    organization: "",
    specialization: "",
    interests: "",
    termsAccepted: false,
    hasPassword: false,
  });

  return (
    <RegFormContext.Provider value={{ regFormData, setRegFormData }}>
      {children}
    </RegFormContext.Provider>
  );
}

export function useRegFormContext() {
  const context = useContext(RegFormContext);
  if (!context) {
    throw new Error("useRegFormContext must be used within RegFormProvider");
  }
  return context;
}
