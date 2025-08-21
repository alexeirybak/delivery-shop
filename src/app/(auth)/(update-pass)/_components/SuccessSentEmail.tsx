import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessSentEmail = ({ email }: { email: string }) => {
  const router = useRouter();

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col items-center">
          <MailCheck className="w-12 h-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold text-center">
            Проверьте Вашу почту
          </h1>
        </div>

        <p>
          Если Вы <strong>регистрировались по email</strong> и аккаунт с email{" "}
          <strong>{email}</strong> существует в нашей системе, мы отправили
          письмо с инструкциями по сбросу пароля.
        </p>

        <div className="text-primary bg-white p-4 rounded border border-primary">
          <h3 className="font-semibold mb-2">Не получили письмо?</h3>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>Проверьте папку «Спам» или «Нежелательная почта»</li>
            <li>
              Убедитесь, что Вы регистрировались именно по email, а не по номеру
              телефона
            </li>
            <li>
              Попробуйте войти с помощью номера телефона, если Вы его указывали
            </li>
            <li>Письмо может приходить с задержкой до 5-10 минут</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-white rounded border border-[#ff6633]">
          <h3 className="font-semibold text-[#ff6633] mb-2">
            Регистрировались по телефону?
          </h3>
          <p className="text-[#ff6633] text-sm">
            Если Вы не помните, как регистрировались, попробуйте
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="text-[#ff6633] font-medium underline hover:no-underline ml-1 cursor-pointer duration-300"
            >
              войти с помощью номера телефона
            </button>
          </p>
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default SuccessSentEmail;
