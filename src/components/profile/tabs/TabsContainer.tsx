
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
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  isOwner
}) => {
  return (
    <Tabs
      defaultValue="posts"
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md">
        <TabsList activeTab={activeTab} />
      </div>

      <PostsTab isOwner={isOwner} />
      <AboutTab isOwner={isOwner} />
      <ServicesTab isOwner={isOwner} />
      <AchievementsTab isOwner={isOwner} openSettings={openSettings} />
    </Tabs>
  );
};

export default TabsContainer;
