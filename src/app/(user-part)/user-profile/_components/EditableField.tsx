import { useState } from "react";
import { Save, Edit2 } from "lucide-react";
import { CustomSelect } from "./CustomSelect";

interface EditableFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string | null;
  fieldName: string;
  placeholder?: string;
  isSelect?: boolean;
  selectOptions?: Array<{ value: string; label: string }>;
  onSave: (field: string, value: string) => Promise<void>;
}

export default function EditableField({
  label,
  icon,
  value,
  fieldName,
  placeholder,
  isSelect = false,
  selectOptions = [],
  onSave,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(fieldName, inputValue);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value || "");
    setIsEditing(false);
  };

  const displayValue = () => {
    if (!value) return "Не указано";
    if (isSelect) {
      return selectOptions.find((opt) => opt.value === value)?.label || value;
    }
    return value;
  };

  return (
    <div className="user-profile-field">
      <div className="user-profile-field-label">
        {icon}
        <span>{label}</span>
      </div>

      {isEditing ? (
        <div className="user-profile-field-edit">
          {isSelect ? (
            <CustomSelect value={inputValue} onChange={setInputValue} />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="user-profile-input"
              placeholder={placeholder}
              autoFocus
            />
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="user-profile-save-btn"
          >
            <Save className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="user-profile-cancel-btn">
            Отмена
          </button>
        </div>
      ) : (
        <div className="user-profile-field-value">
          <span>{displayValue()}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="user-profile-edit-btn"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
