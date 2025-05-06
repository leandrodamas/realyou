
import React from "react";
import TabsContainer from "./tabs/TabsContainer";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSettings: (section?: string) => void;
  isOwner?: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  openSettings,
  isOwner = true 
}) => {
  return (
    <TabsContainer
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openSettings={openSettings}
      isOwner={isOwner}
    />
  );
};

export default ProfileTabs;
