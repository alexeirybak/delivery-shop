interface EditModalProps {
  isOpen: boolean;
  mode: "phaseName" | "task" | "duration";
  value: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const EditModal = ({
  isOpen,
  mode,
  value,
  onValueChange,
  onClose,
  onSubmit,
}: EditModalProps) => {
  if (!isOpen) return null;

  const title =
    mode === "phaseName"
      ? "Название этапа"
      : mode === "task"
        ? "Задача"
        : "Срок";

  return (
    <div className="roadmap-edit-modal">
      <div className="roadmap-edit-modal-content">
        <h3>{title}</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        <div className="roadmap-edit-modal-actions">
          <button onClick={onClose}>Отмена</button>
          <button onClick={onSubmit}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};
