
import React from "react";
import { useAchievements } from "./achievements/useAchievements";
import LoadingState from "./achievements/LoadingState";
import AchievementsContainer from "./achievements/AchievementsContainer";

const ProfileAchievements: React.FC = () => {
  const { achievements, isLoading } = useAchievements();

  if (isLoading) {
    return <LoadingState />;
  }

  return <AchievementsContainer achievements={achievements} />;
};

export default ProfileAchievements;
