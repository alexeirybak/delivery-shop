export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  status: string;
  country: string;
  organization: string;
  specialization: string;
  interests: string;
  termsAccepted: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  general?: string;
}

export interface RegisterFormProps {
  formData: FormData;
  errors: FormErrors;
  isSubmitted: boolean;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // ← добавьте эту строку
}

export interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isSubmitted?: boolean;
  autoComplete?: string;
  placeholder?: string;
  showStrength?: boolean;
  compareWith?: string;
  tooltipMessage?: string;
}
