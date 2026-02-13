export interface ArticleFormProps {
  topic: string;
  selectedCategoryId: string;
  selectedCategorySlug?: string;
  categorySlug?: string;
  isCategoryOpen: boolean;
  isGenerating: boolean;
  error: string | null;
  success: string | null;
  progress: string; 
  onTopicChange: (value: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onToggleCategoryOpen: () => void;
  onGenerate: () => void;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface CategorySelectProps {
  selectedCategoryId: string;
  isOpen: boolean;
  onCategorySelect: (categoryId: string) => void;
  onToggleOpen: () => void;
}

export interface GenerateButtonProps {
  isGenerating: boolean;
  disabled: boolean;
  onClick: () => void;
}

export interface TopicInputProps {
  topic: string;
  categorySlug?: string;
  selectedCategorySlug?: string;
  onTopicChange: (value: string) => void;
}

export interface ImageGenerationResult {
  mainImageUrl: string;
  middleImageUrl: string;
  endImageUrl: string;
}

export interface ArticleData {
  _id: string;
  name: string;
  content: string;
  image: string;
  imageAlt: string;
  [key: string]: unknown;
}

export interface GenerationRequest {
  prompt: string;
  aspect_ratio: string;
  style?: string;
}

export interface ApiResponse {
  success?: boolean;
  operationId?: string;
  imageUrl?: string;
  done?: boolean;
  error?: string;
  details?: string;
  model?: string;
}

export type ProgressCallback = (step: number, stepName: string) => void;