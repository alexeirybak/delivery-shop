export interface CardOwner {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

export interface Card {
  _id: string;
  cardNumber: string;
  order: number;
  createdAt: string;
  isActive: boolean;
  deactivatedAt?: string;
  owner: CardOwner | null;
}

export type FilterType = "all" | "active" | "inactive" | "free" | "assigned";

export interface LoadCardsParams {
  filter?: FilterType;
  searchCardNumber?: string;
  searchOwner?: string;
  page?: number;
  limit?: number;
}

export interface AddCardFormProps {
  onSubmit: (cardNumber: string) => Promise<void>;
  isSubmitting: boolean;
  error: string;
  success: string;
  onErrorChange: (error: string) => void;
  onSuccessChange: (success: string) => void;
}

export interface CardTableProps {
  cards: Card[];
  onToggleActive: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export interface FilterBarProps {
  tempFilter: FilterType;
  tempSearchCardNumber: string;
  tempSearchOwner: string;
  totalItems?: number;
  onTempFilterChange: (filter: FilterType) => void;
  onTempSearchCardNumberChange: (value: string) => void;
  onTempSearchOwnerChange: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}
