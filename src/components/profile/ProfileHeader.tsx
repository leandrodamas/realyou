
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, Link as LinkIcon, Camera, Shield, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name?: string;
  title?: string;
  avatar?: string;
  postCount?: number;
  connectionCount?: number;
  skillsCount?: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name: propName,
  title: propTitle,
  avatar: propAvatar,
  postCount = 0,
  connectionCount = 0,
  skillsCount = 0,
}) => {
  const [followed, setFollowed] = useState(false);
  const [profileData, setProfileData] = useState({
    name: propName || "Usuário",
    title: propTitle || "Profissional",
    avatar: propAvatar || "/placeholder.svg",
  });
  
  // Carregar dados do perfil do localStorage
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          console.log("Profile data loaded in ProfileHeader:", profile);
          setProfileData({
            name: profile.fullName || profile.username || propName || "Usuário",
            title: profile.profession || propTitle || "Profissional",
            avatar: profile.profileImage || propAvatar || "/placeholder.svg"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      }
    };
    
    // Load profile data immediately on mount
    loadProfileData();
    
    // Adicionar listener para atualizações de perfil
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.profile) {
        const profile = customEvent.detail.profile;
        console.log("Profile updated event received in ProfileHeader:", profile);
        setProfileData({
          name: profile.fullName || profile.username || "Usuário",
          title: profile.profession || "Profissional",
          avatar: profile.profileImage || "/placeholder.svg"
        });
      }
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [propName, propTitle, propAvatar]);
  
  return (
    <motion.div 
      className="p-4 border-b bg-white/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-4">
            <Avatar className="h-20 w-20 ring-4 ring-purple-200 ring-offset-2">
              <AvatarImage src={profileData.avatar} alt={profileData.name} className="object-cover" />
              <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Shield className="h-3 w-3 mr-1" /> Verificado
              </Badge>
            </div>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <h2 className="text-xl font-bold mr-2">{profileData.name}</h2>
              <Medal className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-gray-500">{profileData.title}</p>
            <div className="flex space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">Top Creator</Badge>
              <Badge variant="outline" className="text-xs">Membro desde 2023</Badge>
            </div>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon">
            <LinkIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <motion.div 
        className="flex justify-around mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white p-3 rounded-lg shadow-sm"
        >
          <p className="font-bold text-purple-600">{postCount}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white p-3 rounded-lg shadow-sm"
        >
          <p className="font-bold text-blue-500">{connectionCount}</p>
          <p className="text-xs text-gray-500">Conexões</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white p-3 rounded-lg shadow-sm"
        >
          <p className="font-bold text-indigo-500">{skillsCount}</p>
          <p className="text-xs text-gray-500">Habilidades</p>
        </motion.div>
      </motion.div>

      <div className="flex space-x-2 mt-4">
        <Button 
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Mensagem
        </Button>
        <Button 
          variant={followed ? "default" : "outline"} 
          className={`flex-1 ${followed ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}`}
          onClick={() => setFollowed(!followed)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> {followed ? 'Seguindo' : 'Conectar'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
