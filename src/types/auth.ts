import { UserData } from "./userData";

export interface AuthState {
  isAuth: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  fetchUserData: () => Promise<void>;
}
