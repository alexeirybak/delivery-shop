"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RegFormData } from "@/types/regFormData";
import { initialRegFormData } from "@/constants/formData";

type RegFormContextType = {
  regFormData: RegFormData;
  setRegFormData: React.Dispatch<React.SetStateAction<RegFormData>>;
  resetRegForm: () => void;
};

const RegFormContext = createContext<RegFormContextType>({
  regFormData: initialRegFormData,
  setRegFormData: () => {},
  resetRegForm: () => {},
});

export const RegFormProvider = ({ children }: { children: ReactNode }) => {
  const [regFormData, setRegFormData] = useState<RegFormData>(initialRegFormData);

  const resetRegForm = () => {
    setRegFormData(initialRegFormData);
  };

  return (
    <RegFormContext.Provider 
      value={{ regFormData, setRegFormData, resetRegForm }}
    >
      {children}
    </RegFormContext.Provider>
  );
};

export const useRegFormContext = () => useContext(RegFormContext);