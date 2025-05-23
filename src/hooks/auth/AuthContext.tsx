
import { createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  profileLoaded?: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  profileLoaded: false,
  signIn: () => Promise.resolve(false),
  signInWithGoogle: () => Promise.resolve(false),
  signUp: () => Promise.resolve(false),
  signOut: () => Promise.resolve(),
  refreshSession: () => Promise.resolve(),
});

export const useAuth = () => {
  return useContext(AuthContext);
};
