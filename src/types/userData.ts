export type UserData = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  gender: string;
  birthdayDate?: string;
  location?: string;
  region?: string;
  card?: string
} | null;