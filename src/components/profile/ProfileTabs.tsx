import React from "react";
import TabsContainer from "./tabs/TabsContainer";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSettings: (section?: string) => void;
  isOwner: boolean; // Keep isOwner prop
  targetUserId: string; // Add targetUserId prop
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  openSettings,
  isOwner,
  targetUserId // Receive targetUserId
}) => {
  return (
    <TabsContainer
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openSettings={openSettings}
      isOwner={isOwner}
      targetUserId={targetUserId} // Pass targetUserId down
    />
  );
};

export default ProfileTabs;

