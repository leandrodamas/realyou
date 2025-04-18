
import { useState } from "react";
import { achievementCategories } from "@/components/settings/constants/achievementCategories";
import { toast } from "sonner";

export const useSettings = () => {
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

  return {
    // States
    darkMode,
    storyVisibility,
    photoPrivacy,
    notificationsEnabled,
    profileVisibility,
    faceRecPrivacy,
    selectedAchievements,
    
    // Setters
    setDarkMode,
    setStoryVisibility,
    setNotificationsEnabled,
    setProfileVisibility,
    setFaceRecPrivacy,
    
    // Handlers
    handleSaveSettings,
    handlePhotoPrivacyChange,
    handleAchievementChange,
  };
};
