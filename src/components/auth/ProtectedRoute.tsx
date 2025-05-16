
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth",
}) => {
  const { user, isLoading } = useAuth();
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  
  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth loading timeout occurred, proceeding with rendering");
        setTimeoutOccurred(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  // Show loading state
  if (isLoading && !timeoutOccurred) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!user && !timeoutOccurred) {
    toast.error("Você precisa estar logado para acessar esta página");
    return <Navigate to={redirectTo} />;
  }

  // Allow rendering even if there are profile loading issues
  return <>{children}</>;
};

export default ProtectedRoute;
