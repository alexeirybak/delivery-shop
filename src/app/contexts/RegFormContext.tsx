"use client";

import { initialRegFormData } from "@/constants/regFormData";
import { RegFormData } from "@/types/regFormData";
import { createContext, ReactNode, useContext, useState } from "react";

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
  const [regFormData, setRegFormData] =
    useState<RegFormData>(initialRegFormData);

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
