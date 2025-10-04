export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface UserWithCart {
  _id: string;
  email: string;
  cart?: CartItem[];
}
export interface CartProduct extends CartItem {
  product: {
    id: string;
    img: string;
    description: string;
    basePrice: number;
    discountPercent: number;
    categories: string[];
    article: string;
    brand: string;
  };
}
