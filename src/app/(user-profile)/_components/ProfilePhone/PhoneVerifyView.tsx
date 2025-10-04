import { formStyles, profileStyles } from "@/app/styles";

interface PhoneVerifyViewProps {
  currentPhone: string;
  code: string;
  isSaving: boolean;
  onCodeChange: (value: string) => void;
  onVerify: () => void;
  canResend: boolean;
  timeLeft: number;
  onResendCode: () => void;
}

const PhoneVerifyView = ({
  currentPhone,
  code,
  isSaving,
  onCodeChange,
  onVerify,
  canResend,
  timeLeft,
  onResendCode,
}: PhoneVerifyViewProps) => {
  return (
    <div className="mt-4 p-4 bg-green-50 rounded">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-primary font-medium">
          Код подтверждения отправлен на +{currentPhone}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-3 justify-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className={`${formStyles.input} [&&]:w-27.5 [&&]:bg-white block text-center`}
            autoComplete="one-time-code"
          />

          <button
            onClick={onVerify}
            disabled={code.length !== 4 || isSaving}
            className={`${profileStyles.saveButton} [&&]:h-10 bg-primary text-white py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed`}
          >
            {isSaving ? "Проверка..." : "Подтвердить"}
          </button>
        </div>
        <button
          onClick={onResendCode}
          disabled={!canResend}
          className={`px-4 py-2 rounded transition-colors ${
            canResend ? profileStyles.saveButton : profileStyles.cancelButton
          }`}
        >
          {canResend
            ? "Отправить снова..."
            : `Повторить отправку через ${timeLeft} сек`}
        </button>
      </div>
    </div>
  );
};

export default PhoneVerifyView;
