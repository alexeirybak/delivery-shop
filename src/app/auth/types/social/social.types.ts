export interface GoogleAuthButtonProps {
  isLoading?: boolean;
  isGoogleLoading: boolean;
  setIsGoogleLoading: (loading: boolean) => void;
  disabled?: boolean;
  typeAuth: "signUp" | "signIn";
  onCheckTerms?: () => boolean;
}

export interface VkAuthButtonProps {
  isLoading?: boolean;
  isVkLoading: boolean;
  setIsVkLoading: (loading: boolean) => void;
  disabled?: boolean;
  typeAuth: "signUp" | "signIn";
  onCheckTerms?: () => boolean;
}
