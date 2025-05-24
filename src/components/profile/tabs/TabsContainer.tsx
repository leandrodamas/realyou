import React from "react";
import { Tabs } from "@/components/ui/tabs";
import TabsList from "./TabsList";
import PostsTab from "./PostsTab";
import AboutTab from "./AboutTab";
import ServicesTab from "./ServicesTab";
import AchievementsTab from "./AchievementsTab";

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSettings: (section?: string) => void;
  isOwner: boolean;
  targetUserId: string; // Add targetUserId prop
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  isOwner,
  targetUserId // Receive targetUserId
}) => {
  return (
    <Tabs
      defaultValue="posts"
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md">
        {/* TabsList might also need targetUserId if its content depends on the viewed profile */}
        <TabsList activeTab={activeTab} />
      </div>

      {/* Pass targetUserId to each tab content component */}
      <PostsTab isOwner={isOwner} targetUserId={targetUserId} />
      <AboutTab isOwner={isOwner} targetUserId={targetUserId} />
      <ServicesTab isOwner={isOwner} targetUserId={targetUserId} />
      {/* AchievementsTab might not need targetUserId if it always shows viewer's achievements? */}
      {/* Or maybe it should show targetUser's achievements? Passing it for consistency. */}
      <AchievementsTab isOwner={isOwner} openSettings={openSettings} targetUserId={targetUserId} />
    </Tabs>
  );
};

export default TabsContainer;

