
import React from "react";
import { motion } from "framer-motion";
import { Achievement } from "./types";
import AchievementItem from "./AchievementItem";

interface AchievementsContainerProps {
  achievements: Achievement[];
}

const AchievementsContainer: React.FC<AchievementsContainerProps> = ({ achievements }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {achievements.map((achievement) => (
        <AchievementItem key={achievement.id} achievement={achievement} />
      ))}
    </motion.div>
  );
};

export default AchievementsContainer;
