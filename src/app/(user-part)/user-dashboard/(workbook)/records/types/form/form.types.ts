export interface RecordFormData {
  _id?: string | null | undefined;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  categoryName: string;
  content: string;
  isFeatured?: boolean;
}

export interface RecordFormProps {
  onFieldChange: (field: RecordFormField, value: string) => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onCancel: () => void;
  onNewRecord?: () => void;
}

export interface CharCount {
  name: number;
}

export interface RecordFormFieldsProps {
  onInputChange: (fields: RecordFormField, value: string) => void;
}

export type RecordFormField = keyof RecordFormData;

export interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string, categoryName: string) => void;
}
