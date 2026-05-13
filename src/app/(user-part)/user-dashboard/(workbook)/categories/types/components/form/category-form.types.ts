export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

export type CategoryFormField = keyof CategoryFormData;