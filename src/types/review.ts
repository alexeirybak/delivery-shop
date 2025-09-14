export interface Review {
  _id?: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithUser extends Review {
  user?: {
    name: string;
    surname: string;
    email: string;
    avatar?: string;
  };
}