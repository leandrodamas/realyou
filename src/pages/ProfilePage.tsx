
import React, { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posts");
  
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
          name="Seu Perfil"
          title="Configure seu perfil profissional"
          avatar="/placeholder.svg"
          coverImage=""
          postCount={0}
          connectionCount={186}
          skillsCount={5}
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
