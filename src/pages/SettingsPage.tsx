
import React from "react";
import { motion } from "framer-motion";
import SettingsHeader from "@/components/settings/SettingsHeader";
import PrivacySection from "@/components/settings/PrivacySection";
import StoryVisibilitySection from "@/components/settings/StoryVisibilitySection";
import PhotosAndMediaSection from "@/components/settings/PhotosAndMediaSection";
import AchievementsSection from "@/components/settings/AchievementsSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import ThemeToggle from "@/components/settings/ThemeToggle";
import LogoutButton from "@/components/settings/LogoutButton";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import { friendCategories } from "@/components/settings/constants/friendCategories";
import { achievementCategories } from "@/components/settings/constants/achievementCategories";
import { toast } from "sonner";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [storyVisibility, setStoryVisibility] = React.useState("friends");
  const [photoPrivacy, setPhotoPrivacy] = React.useState(["close-friends", "family"]);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [profileVisibility, setProfileVisibility] = React.useState("public");
  const [faceRecPrivacy, setFaceRecPrivacy] = React.useState("friends-only");
  const [selectedAchievements, setSelectedAchievements] = React.useState(
    achievementCategories.filter(cat => cat.public).map(cat => cat.id)
  );

  // Function to handle saving settings
  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  // Function to handle checkbox changes for photo privacy
  const handlePhotoPrivacyChange = (categoryId: string) => {
    setPhotoPrivacy(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Function to handle checkbox changes for achievement visibility
  const handleAchievementChange = (categoryId: string) => {
    setSelectedAchievements(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-24">
      <SettingsHeader />

      <div className="container max-w-md mx-auto p-4">
        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Privacy Section */}
          <div id="privacy">
            <PrivacySection 
              profileVisibility={profileVisibility}
              setProfileVisibility={setProfileVisibility}
              faceRecPrivacy={faceRecPrivacy}
              setFaceRecPrivacy={setFaceRecPrivacy}
              handleSaveSettings={handleSaveSettings}
              fadeIn={fadeIn}
            />
          </div>

          {/* Subscription Section */}
          <div id="subscription">
            <SubscriptionSection fadeIn={fadeIn} />
          </div>

          {/* Story Visibility */}
          <div id="stories">
            <StoryVisibilitySection
              storyVisibility={storyVisibility}
              setStoryVisibility={setStoryVisibility}
              friendCategories={friendCategories}
              handleSaveSettings={handleSaveSettings}
              fadeIn={fadeIn}
            />
          </div>

          {/* Photos and Media */}
          <div id="photos">
            <PhotosAndMediaSection
              photoPrivacy={photoPrivacy}
              friendCategories={friendCategories}
              handlePhotoPrivacyChange={handlePhotoPrivacyChange}
              handleSaveSettings={handleSaveSettings}
              fadeIn={fadeIn}
            />
          </div>

          {/* Achievement Settings */}
          <div id="achievements">
            <AchievementsSection
              achievementCategories={achievementCategories}
              selectedAchievements={selectedAchievements}
              handleAchievementChange={handleAchievementChange}
              handleSaveSettings={handleSaveSettings}
              fadeIn={fadeIn}
            />
          </div>

          {/* Notifications */}
          <div id="notifications">
            <NotificationsSection
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
              handleSaveSettings={handleSaveSettings}
              fadeIn={fadeIn}
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            fadeIn={fadeIn}
          />

          {/* Logout Button */}
          <LogoutButton fadeIn={fadeIn} />
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
