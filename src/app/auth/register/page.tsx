import { Metadata } from "next";
import RegisterPageContent from "./_components/RegisterPageContent";

export const metadata: Metadata = {
  title: "Регистрация | NeuroDidactica",
  description:
    "Создайте аккаунт для доступа к AI-платформе генерации образовательных экосистем",
};

export default function RegisterPage() {
  return <RegisterPageContent />;
}
