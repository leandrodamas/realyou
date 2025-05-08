
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState({
    name: "Seu Perfil",
    title: "Configure seu perfil profissional",
    avatar: "/placeholder.svg",
    coverImage: "",
    postCount: 0,
    connectionCount: 0,
    skillsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      try {
        // Obter usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // Buscar dados do perfil
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Erro ao carregar perfil:", error);
          toast.error("Não foi possível carregar seu perfil");
          setIsLoading(false);
          return;
        }
        
        if (profileData) {
          setProfile({
            name: profileData.full_name || "Seu Perfil",
            title: profileData.profession || "Configure seu perfil profissional",
            avatar: profileData.avatar_url || "/placeholder.svg",
            coverImage: "", // Default empty string as profiles table doesn't have cover_image field yet
            postCount: 0, // Será atualizado quando implementarmos posts
            connectionCount: 0, // Será atualizado quando implementarmos conexões
            skillsCount: 0 // Será atualizado quando implementarmos habilidades
          });
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  const openSettings = (section?: string) => {
    if (section) {
      localStorage.setItem("settingsSection", section);
    }
  };

  return (
    <div className="pb-24">
      <ProfilePageHeader 
        openSettings={openSettings} 
        isOwner={true}
      />
      <div className="max-w-md mx-auto px-4">
        <ProfileHeader 
          name={profile.name}
          title={profile.title}
          avatar={profile.avatar}
          coverImage={profile.coverImage}
          postCount={profile.postCount}
          connectionCount={profile.connectionCount}
          skillsCount={profile.skillsCount}
          isOwner={true}
        />
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          openSettings={openSettings}
          isOwner={true}
        />
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default ProfilePage;
