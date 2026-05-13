import { create } from 'zustand';

export interface RegisterFormData {
  name: string;
  email: string;
  status: string;
  password: string;
  confirmPassword: string;
  country: string;
  organization: string;
  specialization: string;
  interests: string;
  termsAccepted: boolean;
}

export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  general?: string;
}

interface RegisterStore {
  formData: RegisterFormData;
  errors: RegisterErrors;
  isLoading: boolean;
  isSubmitted: boolean;
  
  setField: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
  setErrors: (errors: RegisterErrors) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

const initialFormData: RegisterFormData = {
  name: '',
  email: '',
  status: '',
  password: '',
  confirmPassword: '',
  country: '',
  organization: '',
  specialization: '',
  interests: '',
  termsAccepted: false, 
};

const validatePasswordStrength = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const useRegisterStore = create<RegisterStore>((set, get) => ({
  formData: initialFormData,
  errors: {},
  isLoading: false,
  isSubmitted: false,

  setField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    }));
  },

  validateForm: () => {
    const { formData } = get();
    const errors: RegisterErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Имя обязательно';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Минимум 2 символа';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Некорректный email';
    }
    
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (!validatePasswordStrength(formData.password)) {
      errors.password = 'Пароль должен содержать: минимум 8 символов, заглавные и строчные буквы, цифры и спецсимволы';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!formData.termsAccepted) {
      errors.termsAccepted = 'Необходимо принять условия использования и политику конфиденциальности';
    }

    set({ errors, isSubmitted: true });
    return Object.keys(errors).length === 0;
  },

  setErrors: (errors) => set({ errors }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSubmitted: (submitted) => set({ isSubmitted: submitted }),
  resetForm: () => set({ 
    formData: initialFormData, 
    errors: {}, 
    isSubmitted: false 
  }),
}));