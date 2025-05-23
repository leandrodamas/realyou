
import React, { useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import { signIn, signUp, signOut, signInWithGoogle } from "./authOperations";
import { useProfileLoader } from "./useProfileLoader";
import { useAuthEvents } from "./useAuthEvents";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    profileLoaded, 
    loadUserProfile,
    setProfileLoaded 
  } = useProfileLoader();

  const { handleSessionRefresh } = useAuthEvents(
    setSession,
    setUser,
    setIsLoading,
    loadUserProfile,
    setProfileLoaded
  );

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    return await signIn(email, password, setIsLoading);
  };

  const handleSignUp = async (email: string, password: string): Promise<boolean> => {
    return await signUp(email, password, setIsLoading);
  };

  const handleSignOut = async (): Promise<void> => {
    await signOut(setIsLoading);
  };

  const handleSignInWithGoogle = async (): Promise<boolean> => {
    return await signInWithGoogle();
  };

  return (
    <AuthContext.Provider 
      value={{
        session,
        user,
        isLoading,
        signIn: handleSignIn,
        signInWithGoogle: handleSignInWithGoogle,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshSession: handleSessionRefresh,
        profileLoaded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
