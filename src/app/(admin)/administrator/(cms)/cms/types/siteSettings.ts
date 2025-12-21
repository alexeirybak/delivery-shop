import { ObjectId } from "mongodb";

export interface SiteSettings {
  _id: ObjectId | string;
  siteKeywords: string[];
  semanticCore: string[];
  metaDescription: string;
  siteTitle: string;
  updatedAt: string;
}

export interface FormData {
  siteTitle: string;
  metaDescription: string;
  siteKeywords: string;
  semanticCore: string;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "text" | "textarea";
  placeholder: string;
  hint: string;
  rows?: number;
  showCommaHint?: boolean;
  disabled?: boolean;
}

export interface SEOFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  settings: SiteSettings | null;
  saving: boolean;
  handleSave: (e: React.FormEvent) => void;
  reloading?: boolean;
}

export interface FormButtonsProps {
  saving: boolean;
  disabled?: boolean;
}
