import { profileStyles } from "@/app/styles";

interface PhoneEditViewProps {
  onCancel: () => void;
  onSave?: () => void;
  isSaving: boolean;
  isSendingOTP: boolean;
  isVerificationMode?: boolean;
}

const PhoneEditView = ({
  onCancel,
  onSave,
  isSaving,
  isSendingOTP,
  isVerificationMode,
}: PhoneEditViewProps) => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <button onClick={onCancel} className={profileStyles.cancelButton}>
        Отмена
      </button>
      {!isVerificationMode && onSave && (
        <button
          onClick={onSave}
          className={profileStyles.saveButton}
          disabled={isSaving || isSendingOTP}
        >
          {isSaving
            ? "Сохранение..."
            : isSendingOTP
              ? "Отправка кода"
              : "Сохранить"}
        </button>
      )}
    </div>
  );
};

export default PhoneEditView;
