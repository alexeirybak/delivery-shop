export interface Record {
  _id: string;
  numericId: number;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  image: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
}
