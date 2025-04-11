
import React, { useState } from "react";
import { Settings, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import components
import PrivacySection from "@/components/settings/PrivacySection";
import StoryVisibilitySection from "@/components/settings/StoryVisibilitySection";
import PhotosAndMediaSection from "@/components/settings/PhotosAndMediaSection";
import AchievementsSection from "@/components/settings/AchievementsSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import ThemeToggle from "@/components/settings/ThemeToggle";
import LogoutButton from "@/components/settings/LogoutButton";

// Define the friend categories for visibility settings
const friendCategories = [
  { id: "close-friends", name: "Close Friends", count: 12 },
  { id: "family", name: "Family", count: 8 },
  { id: "coworkers", name: "Coworkers", count: 15 },
  { id: "college", name: "College", count: 23 },
];

// Define the achievement categories
const achievementCategories = [
  { id: "connections", name: "Connections", public: true },
  { id: "content", name: "Content Creation", public: true },
  { id: "skills", name: "Skills Verification", public: false },
  { id: "activity", name: "Activity Streaks", public: true },
  { id: "exclusives", name: "Exclusive Badges", public: false },
];

const SettingsPage: React.FC = () => {
  // State for various settings
  const [darkMode, setDarkMode] = useState(false);
  const [storyVisibility, setStoryVisibility] = useState("friends");
  const [photoPrivacy, setPhotoPrivacy] = useState(["close-friends", "family"]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [faceRecPrivacy, setFaceRecPrivacy] = useState("friends-only");
  const [selectedAchievements, setSelectedAchievements] = useState(
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b sticky top-0 z-10">
        <Link to="/profile" className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5 text-gray-500 rotate-180" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Settings</h1>
        </Link>
        <Button variant="ghost" onClick={() => handleSaveSettings("All")} size="sm">
          Save All
        </Button>
      </header>

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
          <PrivacySection 
            profileVisibility={profileVisibility}
            setProfileVisibility={setProfileVisibility}
            faceRecPrivacy={faceRecPrivacy}
            setFaceRecPrivacy={setFaceRecPrivacy}
            handleSaveSettings={handleSaveSettings}
            fadeIn={fadeIn}
          />

          {/* Story Visibility */}
          <StoryVisibilitySection
            storyVisibility={storyVisibility}
            setStoryVisibility={setStoryVisibility}
            friendCategories={friendCategories}
            handleSaveSettings={handleSaveSettings}
            fadeIn={fadeIn}
          />

          {/* Photos and Media */}
          <PhotosAndMediaSection
            photoPrivacy={photoPrivacy}
            friendCategories={friendCategories}
            handlePhotoPrivacyChange={handlePhotoPrivacyChange}
            handleSaveSettings={handleSaveSettings}
            fadeIn={fadeIn}
          />

          {/* Achievement Settings */}
          <AchievementsSection
            achievementCategories={achievementCategories}
            selectedAchievements={selectedAchievements}
            handleAchievementChange={handleAchievementChange}
            handleSaveSettings={handleSaveSettings}
            fadeIn={fadeIn}
          />

          {/* Notifications */}
          <NotificationsSection
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            handleSaveSettings={handleSaveSettings}
            fadeIn={fadeIn}
          />

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
