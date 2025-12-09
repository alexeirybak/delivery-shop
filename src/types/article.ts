export interface Article {
  _id: string;
  id: number;
  title: string;
  slug: string;
  authorName: string;
  category: string;
  status: "published" | "draft" | "archived" | "deleted";
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}