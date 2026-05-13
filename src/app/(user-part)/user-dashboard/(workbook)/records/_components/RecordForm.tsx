import { useRecordStore } from "@/store/recordStore";
import { ImageSection } from "../../workbook/_components/ImageSection";
import RecordFormFields from "./RecordFormFields";
import { RecordFormField, RecordFormProps } from "../types";
import { RecordSubmitSection } from "./RecordSubmitSection";
import { TiptapEditor } from "./tiptap-components/TiptapEditor";
import { CategorySelect } from "./CategorySelect";
import { useCategoryStore } from "@/store/categoryStore";
import { Plus } from "lucide-react";
import "../styles/record-form.css";

export const RecordForm = ({
  onFieldChange,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
  onNewRecord,
}: RecordFormProps) => {
  const { setIsUploading, formData } = useRecordStore();
  const { categories } = useCategoryStore();

  const handleInputChange = (field: string, value: string) => {
    onFieldChange(field as RecordFormField, value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Размер файла не должен превышать 1MB");
      return;
    }

    setIsUploading(true);

    try {
      onSaveImageFile(file);
    } catch (error) {
      console.error("Ошибка при выборе изображения:", error);
      alert("Ошибка при выборе изображения");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    onFieldChange("categoryId", categoryId);
    onFieldChange("categoryName", categoryName);
  };

  return (
    <div className="record-form">
      <h2 className="record-form-title">Создание новой записи</h2>
      <ImageSection
        type="record"
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onRemoveImage={onRemoveImage}
      />
      <form onSubmit={onSubmit}>
        {categories.length > 0 && (
          <div className="record-form-category-section">
            <h3 className="record-form-category-title">Тетрадь</h3>
            <CategorySelect
              value={formData.categoryId || ""}
              onChange={handleCategoryChange}
            />
          </div>
        )}
        <RecordFormFields onInputChange={handleInputChange} />
        <div className="record-form-content-editor">
          <h3 className="record-form-content-title">Текст записи</h3>
          <TiptapEditor
            content={formData.content || ""}
            onContentChange={(content) => onFieldChange("content", content)}
            categoryName={formData.categoryName}
            recordName={formData.name}
          />
            <button
              onClick={onNewRecord}
              className="new-record-btn"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Новая запись
            </button>
        </div>
        <RecordSubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};
