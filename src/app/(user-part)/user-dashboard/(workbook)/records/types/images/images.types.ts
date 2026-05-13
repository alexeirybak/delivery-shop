import { RecordFormField } from "../form/form.types";

export interface ImageSectionProps {
  type: "record" | "category" | "others";
  errors?: Record<string, string>;
  onRemoveImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (field: RecordFormField, value: string) => void;
}
