import Link from "next/link";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";

export default function GoodbyePage() {
  return (
    <AuthFormLayout>
      <div className="bg-white flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-main-text mb-4">
          Ваш аккаунт был удален
        </h1>
        <p className="text-main-text mb-6">
          Спасибо, что были с нами. Все ваши данные были успешно удалены.
        </p>
        <Link
          href="/"
          className="bg-primary hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) w-full text-center text-white text-2xl px-3 py-2 cursor-pointer rounded duration-300"
        >
          На главную
        </Link>
      </div>
    </AuthFormLayout>
  );
}
