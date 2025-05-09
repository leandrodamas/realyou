
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthButton: React.FC = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);

  // Function to load profile from Supabase
  const loadProfileFromSupabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error loading profile from Supabase:", error);
        return;
      }
      
      if (data) {
        if (data.avatar_url) setProfileImage(data.avatar_url);
        if (data.full_name) setUsername(data.full_name);
      }
    } catch (err) {
      console.error("Error in profile fetch:", err);
    }
  };

  useEffect(() => {
    // Load profile on mount if user is logged in
    if (user) {
      loadProfileFromSupabase(user.id);
    }
    
    // Listen for profile updates
    const handleProfileUpdate = (e: Event) => {
      if (e instanceof CustomEvent && e.detail?.profile) {
        setProfileImage(e.detail.profile.profileImage || e.detail.profile.avatar_url);
        setUsername(e.detail.profile.fullName || e.detail.profile.username);
      }
    };
    
    const handleProfileLoaded = (e: Event) => {
      if (e instanceof CustomEvent && e.detail?.profile) {
        setProfileImage(e.detail.profile.avatar_url);
        setUsername(e.detail.profile.username || e.detail.profile.fullName);
      }
    };

    // Load initial profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
        if (profile.username) {
          setUsername(profile.username);
        }
      } catch (error) {
        console.error("Error parsing profile data", error);
      }
    }

    document.addEventListener('profileUpdated', handleProfileUpdate);
    document.addEventListener('profileLoaded', handleProfileLoaded);
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate);
      document.removeEventListener('profileLoaded', handleProfileLoaded);
    };
  }, [user]);

  if (user) {
    // User is logged in, show avatar
    return (
      <Link to="/profile" className="block">
        <Avatar className="h-9 w-9 border-2 border-white">
          <AvatarImage src={profileImage} alt={username || user.email || "User"} />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white text-xs">
            {username ? username.substring(0, 2).toUpperCase() : 
              (user.email?.substring(0, 2).toUpperCase() || "U")}
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
