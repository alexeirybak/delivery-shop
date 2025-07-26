export interface UserData {
  email: string;
  phone: string;
  surname: string;
  firstName: string;
  password: string;
  birthdayDate: string;
  region: string;
  location: string;
  gender: string;
  card: string;
  hasCard: boolean;
}

export interface UserDocument extends UserData {
  _id?: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}