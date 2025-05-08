import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const AuthButton: React.FC = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Listen for profile updates
    const handleProfileUpdate = (e: Event) => {
      if (e instanceof CustomEvent && e.detail?.profile) {
        setProfileImage(e.detail.profile.profileImage);
      }
    };

    // Load initial profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
      } catch (error) {
        console.error("Error parsing profile data", error);
      }
    }

    document.addEventListener('profileUpdated', handleProfileUpdate);
    return () => document.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);

  if (user) {
    // User is logged in, show avatar
    return (
      <Link to="/profile" className="block">
        <Avatar className="h-9 w-9 border-2 border-white">
          <AvatarImage src={profileImage} alt={user.email || "User"} />
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
