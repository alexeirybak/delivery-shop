"use client";

import { useRouter } from "next/navigation";
import { buttonStyles, formStyles } from "../../styles";

const RegFormFooter = ({
  isFormValid,
  isLoading,
}: {
  isFormValid: boolean;
  isLoading: boolean;
}) => {
  const router = useRouter();

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace("/login");
  };

  return (
    <>
      <button
        disabled={isLoading}
        type="submit"
        className={`${buttonStyles.base} ${
          isFormValid ? buttonStyles.active : buttonStyles.inactive
        }`}
      >
        Продолжить
      </button>
      <button 
        className={formStyles.loginLink}
        onClick={handleLoginClick}
      >
        Вход
      </button>
    </>
  );
};

export default RegFormFooter;