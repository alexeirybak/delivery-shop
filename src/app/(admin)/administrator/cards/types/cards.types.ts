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
