import { Loader2, Trash2, Mail } from "lucide-react";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";

interface DeleteAccountInitialStepProps {
  loading: boolean;
  error: string;
  canResend: boolean;
  timeLeft: number;
  onSendCode: (e: React.FormEvent) => void;
}

export const DeleteAccountInitialStep = ({
  loading,
  error,
  canResend,
  timeLeft,
  onSendCode,
}: DeleteAccountInitialStepProps) => {
  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col items-center">
          <Trash2 className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-center">Удаление аккаунта</h1>
        </div>
        <p className="text-center text-red-600 font-medium">
          Внимание! Это действие необратимо. Все Ваши данные будут удалены без
          возможности восстановления.
        </p>

        <p className="text-center">
          Для подтверждения удаления аккаунта мы отправим SMS с кодом на
          телефон, по которому Вы регистрировались.
        </p>

        {error && (
          <div className="p-3 bg-[#ffc7c7] text-[#d80000] text-center rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={onSendCode}
          className="mx-auto flex flex-col justify-center"
          autoComplete="off"
        >
          <button
            type="submit"
            disabled={loading || !canResend}
            className="flex-1 flex flex-row items-center justify-center gap-x-3 bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 py-2 h-10 rounded font-medium duration-300 text-center cursor-pointer disabled:bg-[#fcd5ba]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Отправка...
              </>
            ) : !canResend ? (
              `Ждите ${timeLeft} сек`
            ) : (
              <>
                <Mail className="w-4 h-4 flex-shrink-0" />
                Получить код подтверждения
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};
