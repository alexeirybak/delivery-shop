import Link from "next/link";
import { buttonStyles, formStyles } from "./styles";

export default function RegFormFooter({ isFormValid }: { isFormValid: boolean }) {
  return (
    <>
      <button
        type="submit"
        disabled={!isFormValid}
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
}