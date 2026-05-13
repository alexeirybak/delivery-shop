import { useRecordStore } from "@/store/recordStore";
import { RecordFormFieldsProps } from "../types";
import "../styles/record-form-fields.css";

const RecordFormFields = ({ onInputChange }: RecordFormFieldsProps) => {
  const { isSubmitting, formData } = useRecordStore();
  return (
    <div className="record-form-fields">
      <div className="record-form-field">
        <div className="record-form-field-header">
          <label className="record-form-field-label">Название записи</label>
        </div>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          disabled={isSubmitting}
          className="record-form-input"
          placeholder="Например: Простые и сложные вещества"
        />
      </div>
      <div className="record-form-field">
        <div className="record-form-field-header">
          <label className="record-form-field-label">Описание записи</label>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          rows={3}
          disabled={isSubmitting}
          placeholder="Например: В этой записи у меня..."
          className="record-form-textarea"
        />
      </div>
    </div>
  );
};

export default RecordFormFields;
