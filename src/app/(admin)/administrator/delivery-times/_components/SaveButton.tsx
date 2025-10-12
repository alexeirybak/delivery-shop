import { buttonStyles } from "@/app/styles";

interface SaveButtonProps {
  saving: boolean;
  onClick: () => void;
  className?: string;
}

export default function SaveButton({
  saving,
  onClick,
  className = "",
}: SaveButtonProps) {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onClick}
        disabled={saving}
        className={`${buttonStyles.active} px-4 py-2 [&&]:w-full ${className}`}
      >
        {saving ? "Сохранение..." : "Сохранить расписание"}
      </button>
    </div>
  );
}
