"use client";

import Link from "next/link";
import { buttonStyles, formStyles } from "../../../styles";

const RegFormFooter = ({
  isFormValid,
  isLoading,
}: {
  isFormValid: boolean;
  isLoading: boolean;
}) => {
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
      <Link href="/login" className={formStyles.loginLink}>
        Вход
      </Link>
    </>
  );
};

export default RegFormFooter;
