export type UserRole = "user" | "admin" | "manager";

export interface UserData {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "manager";
  image: string;
  avatar: string;
  banned: boolean;
  emailVerified: boolean;
  status: string;
  country: string;
  organization: string;
  specialization: string;
  interests: string;
  balance: number;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserDataOrNull = UserData | null;

