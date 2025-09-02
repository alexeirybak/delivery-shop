import { formStyles, profileStyles } from "@/app/(auth)/styles";

interface PhoneVerifyViewProps {
  currentPhone: string;
  code: string;
  onCodeChange: (value: string) => void;
  onVerify: () => void;
  onResendCode: () => void;
  isSaving: boolean;
  canResend: boolean;
  timeLeft: number;
}

const PhoneVerifyView = ({
  currentPhone,
  code,
  onCodeChange,
  onVerify,
  onResendCode,
  isSaving,
  canResend,
  timeLeft,
}: PhoneVerifyViewProps) => {
  return (
    <div className="mt-4 p-4 bg-green-50 rounded">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-primary font-medium">
          Код подтверждения отправлен на +{currentPhone}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className={`${formStyles.input} [&&]:w-full [&&]:bg-white`}
          placeholder="Введите 4-значный код"
          autoComplete="one-time-code"
        />

        <div className="flex gap-2">
          <button
            onClick={onVerify}
            disabled={code.length !== 4 || isSaving}
            className={`${profileStyles.saveButton} flex-1 bg-primary text-white py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {isSaving ? "Проверка..." : "Подтвердить"}
          </button>

          <button
            onClick={onResendCode}
            disabled={!canResend}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canResend ? "Отправить снова" : `Ждать ${timeLeft} сек`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerifyView;