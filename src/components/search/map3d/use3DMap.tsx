
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { Professional } from "@/types/Professional";

export const use3DMap = (professionals: Professional[]) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Update login state when user changes
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    // Set loading state initially
    setIsLoading(true);
    
    // Simulate map initialization with a timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      console.log("Map initialized with professionals:", professionals);
      setIsLoading(false);
    }, 800);
    
    // Refresh the component when login state changes
    const handleProfileLoaded = () => {
      console.log("Profile loaded, refreshing 3D map");
      // Force refresh the map visualization in a more efficient way
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
    
    const handleAuthStateChange = (e: Event) => {
      if (e instanceof CustomEvent) {
        console.log("Auth state changed, refreshing 3D map");
        setIsLoggedIn(!!user);
      }
    };
    
    document.addEventListener('profileLoaded', handleProfileLoaded);
    document.addEventListener('authStateChange', handleAuthStateChange);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      document.removeEventListener('profileLoaded', handleProfileLoaded);
      document.removeEventListener('authStateChange', handleAuthStateChange);
    };
  }, [professionals, user]);

  const handleBecomeProfessional = () => {
    if (!isLoggedIn) {
      toast.info("Faça login para se tornar um profissional");
    } else {
      // Logic for registered users
      toast.info("Preparando seu cadastro profissional...");
    }
  };
  
  return { isLoading, isLoggedIn, handleBecomeProfessional };
};
