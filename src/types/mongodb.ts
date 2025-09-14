import { Document, ObjectId } from 'mongodb';

export interface ReviewDocument extends Document {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends Document {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  avatar?: string;
}

export interface ProductDocument extends Document {
  _id: ObjectId;
  rating?: {
    rate: number;
    count: number;
  };
}