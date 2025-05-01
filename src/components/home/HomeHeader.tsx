
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const HomeHeader: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("ME");
  
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          console.log("HomeHeader: Carregando perfil do usuário:", profile);
          
          if (profile.profileImage) {
            setProfileImage(profile.profileImage);
          }
          
          if (profile.fullName) {
            const nameParts = profile.fullName.split(' ');
            let initials = '';
            if (nameParts.length >= 1) {
              initials += nameParts[0].charAt(0);
            }
            if (nameParts.length >= 2) {
              initials += nameParts[nameParts.length - 1].charAt(0);
            }
            if (initials) {
              setUserInitials(initials.toUpperCase());
            }
          } else if (profile.username) {
            setUserInitials(profile.username.substring(0, 2).toUpperCase());
          }
        }
      } catch (error) {
        console.error("HomeHeader: Erro ao carregar perfil:", error);
      }
    };
    
    // Carrega o perfil imediatamente
    loadProfileData();
    
    // Configura o listener para atualizações de perfil
    const handleProfileUpdate = (event: CustomEvent<{profile: any}>) => {
      try {
        console.log("HomeHeader: Recebido evento de atualização de perfil");
        const profile = event.detail.profile;
        
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
        
        if (profile.fullName) {
          const nameParts = profile.fullName.split(' ');
          let initials = '';
          if (nameParts.length >= 1) {
            initials += nameParts[0].charAt(0);
          }
          if (nameParts.length >= 2) {
            initials += nameParts[nameParts.length - 1].charAt(0);
          }
          if (initials) {
            setUserInitials(initials.toUpperCase());
          }
        }
      } catch (error) {
        console.error("HomeHeader: Erro ao processar atualização de perfil:", error);
      }
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-xl p-4 flex justify-between items-center border-b border-gray-100 shadow-sm sticky top-0 z-20"
    >
      <div className="flex items-center space-x-2">
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          RealYou
        </motion.h1>
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/search">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-gray-100 p-2.5 hover:bg-gray-200 transition-colors"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </motion.button>
        </Link>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-gray-100 p-2.5 hover:bg-gray-200 transition-colors relative"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </motion.button>
        
        <Link to="/profile">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="h-10 w-10 border-2 border-purple-200">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </Link>
      </div>
    </motion.header>
  );
};

export default HomeHeader;
