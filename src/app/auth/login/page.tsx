import { Metadata } from "next";
import { LoginPageContent } from "./_components/LoginPageContent";

export const metadata: Metadata = {
  title: "Вход | NeuroDidactica",
  description: "Войдите в свой аккаунт для доступа к AI-платформе",
};

export default function LoginPage() {
  return <LoginPageContent />;
}
