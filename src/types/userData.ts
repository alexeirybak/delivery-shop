export type UserRole = "user" | "admin" | "manager";

export interface UserData {
  _id: string;
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin" | "manager";
  birthdayDate: string;
  region: string;
  location: string;
  gender: string;
  card: string;
  hasCard: boolean;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
}

export type UserDataOrNull = UserData | null;
