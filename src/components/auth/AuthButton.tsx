
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const AuthButton: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    // User is logged in, show avatar
    return (
      <Link to="/profile" className="block">
        <Avatar className="h-9 w-9 border-2 border-white">
          <AvatarImage 
            src={localStorage.getItem('userProfile') 
              ? JSON.parse(localStorage.getItem('userProfile')!).profileImage 
              : undefined
            } 
            alt={user.email || "User"} 
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white text-xs">
            {user.email?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  }

  // User is not logged in, show login button
  return (
    <Link to="/auth">
      <Button variant="outline" size="sm" className="rounded-full">
        <User className="h-4 w-4 mr-1" />
        Login
      </Button>
    </Link>
  );
};

export default AuthButton;
