
import React, { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import QuickSettingsSection from "@/components/profile/QuickSettingsSection";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";
import { useLocation } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation();

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["posts", "about", "services", "achievements"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

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
      <ProfilePageHeader openSettings={openSettings} />

      {/* Profile Info */}
      <ProfileHeader 
        name="Alex Johnson"
        title="Software Developer"
        avatar="/placeholder.svg"
        postCount={24}
        connectionCount={186}
        skillsCount={12}
      />

      {/* Quick Settings Access */}
      <QuickSettingsSection openSettings={openSettings} />

      {/* Interactive Tabs with Animation */}
      <ProfileTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openSettings={openSettings}
      />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default ProfilePage;
