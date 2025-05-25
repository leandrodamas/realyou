
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";
import { useAuth } from "@/hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { initializeUserProfile } from "@/hooks/auth/profile";
import { Professional } from "@/hooks/useSearchProfessionals";

const ProfilePage: React.FC = () => {
  const { userId: routeUserId } = useParams<{ userId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState<Partial<Professional> & { coverImage?: string, postCount?: number, connectionCount?: number, skillsCount?: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Determine target user ID and if the viewer is the owner
  const targetUserId = routeUserId || user?.id;

  useEffect(() => {
    setIsOwner(!!user && targetUserId === user.id);
  }, [user, targetUserId]);

  // Redirect to login if trying to view own profile while logged out
  useEffect(() => {
    if (!isLoading && !user && !routeUserId) {
      toast.error("Faça login para acessar seu perfil");
      navigate("/auth");
    }
  }, [user, isLoading, navigate, routeUserId]);

  // Load profile data based on targetUserId
  const loadProfile = useCallback(async () => {
    if (!targetUserId) {
      setIsLoading(false);
      if (user) {
          console.log("Aguardando ID do usuário autenticado...");
      } else if (!routeUserId) {
          console.log("Nenhum ID de perfil para carregar.");
      }
      return;
    }

    setIsLoading(true);
    try {
      // Fixed SQL query - removed invalid comment syntax
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          profession,
          avatar_url,
          created_at,
          updated_at
        `)
        .eq("id", targetUserId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Não foi possível carregar o perfil.");
        setProfile({});
        setIsLoading(false);
        return;
      }

      if (profileData) {
        console.log("Profile data loaded:", profileData);
        setProfile({
          id: profileData.id,
          user_id: profileData.id,
          name: profileData.full_name || "Usuário",
          username: profileData.id,
          title: profileData.profession || (isOwner ? "Configure seu perfil" : "Profissional"),
          avatar: profileData.avatar_url || "/placeholder.svg",
          location: "Localização não informada",
          postCount: 0,
          connectionCount: 0,
          skillsCount: 0,
        });
      } else {
        // Profile not found, create one if user is owner
        if (isOwner && user) {
          console.log("Creating new profile for user:", user.id);
          await initializeUserProfile(user.id);
          // Retry loading after initialization
          setTimeout(() => loadProfile(), 1000);
        } else {
          toast.error("Perfil não encontrado.");
          setProfile({});
        }
      }
    } catch (err) {
      console.error("Erro inesperado ao carregar perfil:", err);
      toast.error("Ocorreu um erro ao carregar o perfil.");
      setProfile({});
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, isOwner, user]);

  useEffect(() => {
    loadProfile();

    // Listen for profile updates
    const handleProfileUpdate = (e: Event) => {
      if (isOwner && e instanceof CustomEvent && e.detail?.profile) {
        console.log("Evento profileUpdated recebido, recarregando perfil...");
        loadProfile();
      }
    };

    document.addEventListener("profileUpdated", handleProfileUpdate as EventListener);

    return () => {
      document.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
    };
  }, [loadProfile, isOwner]);

  const openSettings = (section?: string) => {
    if (!isOwner) return;
    if (section) {
      localStorage.setItem("settingsSection", section);
    }
    navigate("/settings");
  };

  const handleNewPublication = () => {
    if (!isOwner) return;
    toast.info("Funcionalidade de nova publicação em desenvolvimento");
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // If no profile and not owner, show not found
  if (!profile.id && !isOwner) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">Perfil não encontrado</p>
          <p className="text-gray-500 mt-2">O usuário que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <ProfilePageHeader
        openSettings={openSettings}
        isOwner={isOwner}
        targetUserId={targetUserId}
      />
      <div className="max-w-md mx-auto px-4">
        <ProfileHeader
          name={profile.name || "Usuário"}
          title={profile.title || (isOwner ? "Configure seu perfil" : "Profissional")}
          avatar={profile.avatar || "/placeholder.svg"}
          coverImage={profile.coverImage}
          postCount={profile.postCount || 0}
          connectionCount={profile.connectionCount || 0}
          skillsCount={profile.skillsCount || 0}
          isOwner={isOwner}
        />
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSettings={openSettings}
          isOwner={isOwner}
          targetUserId={targetUserId}
        />
      </div>
      {isOwner && <FloatingActionButton onNewPost={handleNewPublication} />}
    </div>
  );
};

export default ProfilePage;
