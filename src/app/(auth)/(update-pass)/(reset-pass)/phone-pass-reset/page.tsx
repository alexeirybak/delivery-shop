"use client";

import { useState } from "react";
import { PhonePasswordResetRequest } from "../../_components/PhonePasswordResetRequest";
import { PhonePasswordResetVerify } from "../../_components/PhonePasswordResetVerify";
const PhonePasswordReset = () => {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep("verify");
  };

  const handleBack = () => {
    setStep("request");
    setError(null);
  };

  if (step === "verify") {
    return (
      <PhonePasswordResetVerify
        phone={phone}
        loading={loading}
        setLoadingAction={setLoading}
        error={error}
        setErrorAction={setError}
        onBackAction={handleBack}
      />
    );
  }

  return (
    <PhonePasswordResetRequest
      onSuccessAction={handleRequestSuccess}
      loading={loading}
      setLoadingAction={setLoading}
      error={error}
      setErrorAction={setError}
    />
  );
};

export default PhonePasswordReset;
