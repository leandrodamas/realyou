
import React, { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import QuickSettingsSection from "@/components/profile/QuickSettingsSection";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";
import { useLocation } from "react-router-dom";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation();
  const { getProfile } = useProfileStorage();
  const [profileData, setProfileData] = useState<any>({
    name: "Seu Perfil",
    title: "Configure seu perfil profissional",
    avatar: null,
    postCount: 0,
    connectionCount: 0,
    skillsCount: 0
  });
  const [isOwner, setIsOwner] = useState(true);

  // Function to update profile data
  const updateProfileData = () => {
    try {
      const profile = getProfile();
      if (profile) {
        console.log("ProfilePage: Perfil carregado:", profile);
        setProfileData({
          name: profile.fullName || profile.username || "Seu Perfil",
          title: profile.title || "Configure seu perfil profissional",
          avatar: profile.profileImage || null,
          postCount: profile.postCount || 0,
          connectionCount: profile.connectionCount || 186,
          skillsCount: profile.skillsCount || 5
        });
        
        // If the user has a profile, they're registered
        if (profile.fullName) {
          // This is to ensure they're not shown as a new user
          localStorage.setItem('isRegistered', 'true');
        }
      } else {
        console.log("ProfilePage: Nenhum perfil encontrado, usando dados padrão");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Não foi possível carregar seu perfil");
    }
  };

  useEffect(() => {
    // Load profile data
    updateProfileData();

    // Listen for profile updated events
    const handleProfileUpdate = () => {
      console.log("ProfilePage: Evento de atualização de perfil recebido");
      updateProfileData();
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate);

    // Check if there's a tab parameter in the URL
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["posts", "about", "services", "achievements"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [location, getProfile]);

  const openSettings = (section?: string) => {
    if (section) {
      // We could store the active section in localStorage or context
      // to open the settings directly on that section
      localStorage.setItem("settingsSection", section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <ProfilePageHeader openSettings={openSettings} isOwner={isOwner} />

      {/* Profile Info */}
      <ProfileHeader 
        name={profileData.name}
        title={profileData.title}
        avatar={profileData.avatar || "/placeholder.svg"}
        postCount={profileData.postCount}
        connectionCount={profileData.connectionCount}
        skillsCount={profileData.skillsCount}
        isOwner={isOwner}
      />

      {/* Quick Settings Access */}
      {isOwner && <QuickSettingsSection openSettings={openSettings} />}

      {/* Interactive Tabs with Animation */}
      <ProfileTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openSettings={openSettings}
        isOwner={isOwner}
      />

      {/* Floating Action Button - apenas para o próprio usuário */}
      {isOwner && <FloatingActionButton />}
    </div>
  );
};

export default ProfilePage;
