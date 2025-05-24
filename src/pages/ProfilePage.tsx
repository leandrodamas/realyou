import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";
import { useAuth } from "@/hooks/auth";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { initializeUserProfile } from "@/hooks/auth/profile";
import { Professional } from "@/hooks/useSearchProfessionals"; // Import Professional type

const ProfilePage: React.FC = () => {
  const { userId: routeUserId } = useParams<{ userId?: string }>(); // Get userId from route params
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
      // If no target ID and not logged in, redirect handled above
      // If logged in but no target ID, it implies viewing own profile, but user object might still be loading
      if (user) {
          console.log("Aguardando ID do usuário autenticado...");
      } else if (!routeUserId) {
          console.log("Nenhum ID de perfil para carregar.");
      }
      return;
    }

    setIsLoading(true);
    try {
      // Fetch profile data from Supabase for the target user
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          profession,
          avatar_url,
          address,
          latitude,
          longitude,
          bio
          -- TODO: Add fields for postCount, connectionCount, skillsCount if they exist
        `)
        .eq("id", targetUserId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Não foi possível carregar o perfil.");
        setProfile({}); // Clear profile on error
        setIsLoading(false);
        // Optionally navigate back or show an error state
        // navigate("/");
        return;
      }

      if (profileData) {
        setProfile({
          id: profileData.id, // Assuming service_pricing ID is not needed here, using profile ID
          user_id: profileData.id,
          name: profileData.full_name || "Usuário",
          username: profileData.id,
          title: profileData.profession || (isOwner ? "Configure seu perfil" : "Profissional"),
          avatar: profileData.avatar_url || "/placeholder.svg",
          location: profileData.address || "Localização não informada",
          coordinates: profileData.latitude && profileData.longitude ? { lat: profileData.latitude, lng: profileData.longitude } : undefined,
          // Placeholder counts - these should ideally come from related tables or aggregated columns
          postCount: 0,
          connectionCount: 0,
          skillsCount: 0,
          // coverImage: profileData.cover_image_url || "", // Add if cover image exists
        });

        // If owner, maybe update local storage cache?
        if (isOwner) {
            // Consider updating localStorage cache if used consistently
            // localStorage.setItem("userProfile", JSON.stringify(profileData));
        }

      } else {
        // Handle case where profile is not found
        toast.error("Perfil não encontrado.");
        setProfile({});
        // navigate("/"); // Navigate away if profile doesn't exist?
      }
    } catch (err) {
      console.error("Erro inesperado ao carregar perfil:", err);
      toast.error("Ocorreu um erro ao carregar o perfil.");
      setProfile({});
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, isOwner, user]); // Add user dependency

  useEffect(() => {
    loadProfile();

    // Listen for profile updates (relevant if viewing own profile)
    const handleProfileUpdate = (e: Event) => {
      if (isOwner && e instanceof CustomEvent && e.detail?.profile) {
        console.log("Evento profileUpdated recebido, recarregando perfil...");
        loadProfile(); // Reload profile data on update
      }
    };

    document.addEventListener("profileUpdated", handleProfileUpdate as EventListener);

    return () => {
      document.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
    };
  }, [loadProfile, isOwner]); // Add isOwner dependency

  const openSettings = (section?: string) => {
    if (!isOwner) return; // Prevent non-owners from opening settings
    if (section) {
      localStorage.setItem("settingsSection", section);
    }
    navigate("/settings");
  };

  const handleNewPublication = () => {
    if (!isOwner) return;
    toast.info("Funcionalidade de nova publicação em desenvolvimento");
    // Open upload work dialog later
  };

  // Render loading state or profile not found
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando perfil...</div>; // Add a proper loading spinner
  }

  if (!profile.id) {
      return <div className="flex justify-center items-center min-h-screen">Perfil não encontrado ou erro ao carregar.</div>;
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Pass targetUserId to header if needed for actions like connecting */} 
      <ProfilePageHeader
        openSettings={openSettings}
        isOwner={isOwner}
        targetUserId={targetUserId} // Pass target ID
      />
      <div className="max-w-md mx-auto px-4">
        <ProfileHeader
          name={profile.name || "Usuário"}
          title={profile.title || ""}
          avatar={profile.avatar || "/placeholder.svg"}
          coverImage={profile.coverImage}
          postCount={profile.postCount || 0}
          connectionCount={profile.connectionCount || 0}
          skillsCount={profile.skillsCount || 0}
          isOwner={isOwner}
        />
        {/* Pass targetUserId to tabs if needed for fetching data specific to the viewed profile */}
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSettings={openSettings}
          isOwner={isOwner}
          targetUserId={targetUserId} // Pass target ID
        />

        {/* Content for tabs will be rendered inside ProfileTabs component */}
        {/* Example: Placeholder for empty state if needed outside tabs */}
        {/* {activeTab === "posts" && !isLoading && profile.postCount === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm mt-4">
             ... No posts content ...
          </div>
        )} */} 
      </div>
      {isOwner && <FloatingActionButton onNewPost={handleNewPublication} />}
    </div>
  );
};

export default ProfilePage;

