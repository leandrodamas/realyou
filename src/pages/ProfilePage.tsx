
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if no user
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Faça login para acessar seu perfil");
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      try {
        // Obter usuário autenticado
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // First check localStorage for cached profile
        const cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile) {
          try {
            const profileData = JSON.parse(cachedProfile);
            setProfile({
              name: profileData.fullName || profileData.username || "Seu Perfil",
              title: profileData.title || "Configure seu perfil profissional",
              avatar: profileData.profileImage || profileData.avatar_url || "/placeholder.svg",
              coverImage: profileData.coverImage || "",
              postCount: profileData.postCount || 0,
              connectionCount: profileData.connectionCount || 0,
              skillsCount: profileData.skillsCount || 0
            });
          } catch (error) {
            console.error("Error parsing cached profile:", error);
          }
        }
        
        // Then try to fetch from Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Erro ao carregar perfil:", error);
          
          // Still using the cached profile if we have it
          if (!cachedProfile) {
            toast.error("Não foi possível carregar seu perfil");
          }
          setIsLoading(false);
          return;
        }
        
        if (profileData) {
          setProfile({
            name: profileData.full_name || "Seu Perfil",
            title: profileData.profession || "Configure seu perfil profissional",
            avatar: profileData.avatar_url || "/placeholder.svg",
            coverImage: "", // Default empty string as profiles table doesn't have cover_image field
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
    
    // Listen for profile updates
    const handleProfileUpdate = (e: Event) => {
      if (e instanceof CustomEvent && e.detail?.profile) {
        const updatedProfile = e.detail.profile;
        setProfile({
          name: updatedProfile.fullName || updatedProfile.username || "Seu Perfil",
          title: updatedProfile.title || "Configure seu perfil profissional",
          avatar: updatedProfile.profileImage || updatedProfile.avatar_url || "/placeholder.svg",
          coverImage: updatedProfile.coverImage || "",
          postCount: 0,
          connectionCount: 0,
          skillsCount: 0
        });
      }
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, [user]);

  const openSettings = (section?: string) => {
    if (section) {
      localStorage.setItem("settingsSection", section);
    }
    navigate("/settings");
  };
  
  const handleNewPublication = () => {
    toast.info("Funcionalidade de nova publicação em desenvolvimento");
    // Open upload work dialog later
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
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
        
        {/* Simple no content state for empty profile */}
        {activeTab === "posts" && (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm mt-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM11 17H13V13H17V11H13V7H11V11H7V13H11V17Z" fill="#3B82F6"/>
              </svg>
            </div>
            <h3 className="text-md font-medium mb-2">Nenhuma publicação</h3>
            <p className="text-sm text-gray-500 mb-4">Adicione seu primeiro trabalho para mostrar aos clientes</p>
            <button 
              onClick={handleNewPublication}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
            >
              Nova Publicação
            </button>
          </div>
        )}
      </div>
      <FloatingActionButton onNewPost={handleNewPublication} />
    </div>
  );
};

export default ProfilePage;
