import { MailCheck } from "lucide-react";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { MagneticButton } from "@/app/shared/magneticButton/MagneticButton";
import { useRouter } from "next/navigation";

export const SuccessSent = () => {
  const { regFormData } = useRegFormContext();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 py-12 bg-panel">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="p-4 rounded-full bg-[rgba(109,241,255,0.1)] border border-[rgba(109,241,255,0.2)]">
          <MailCheck className="h-10 w-10 text-cyan" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-text">Письмо отправлено!</h2>
          <p className="text-muted max-w-md text-base leading-relaxed">
            Мы отправили email с подтверждением на{" "}
            <span className="font-semibold text-cyan">{regFormData.email}</span>
            <br />
            Пожалуйста, проверьте почту и следуйте инструкциям в письме.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <MagneticButton
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            router.replace("/auth/login");
          }}
        >
          Перейти к авторизации
        </MagneticButton>
      </div>
    </div>
  );
};
