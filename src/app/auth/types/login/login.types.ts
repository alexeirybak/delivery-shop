export interface EmailStepProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isChecking: boolean;
  errors: { email?: string };
  onCheckEmail: () => void;
}

export interface PasswordStepProps {
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordError?: string;
  isLoading: boolean;
  onBackToEmail: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface SocialAuthProps {
  termsAccepted: boolean;
  onTermsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  termsError?: string;
  isLoading: boolean;
  isGoogleLoading: boolean;
  setIsGoogleLoading: (value: boolean) => void;
  isVkLoading: boolean;
  setIsVkLoading: (value: boolean) => void;
  onSetErrors: (errors: { termsAccepted?: string }) => void;
}
