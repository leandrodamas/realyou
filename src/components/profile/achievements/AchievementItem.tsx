
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "./types";

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  return (
    <motion.div
      key={achievement.id}
      className={`p-4 rounded-xl border ${achievement.color || 'bg-gray-100 border-gray-200'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {achievement.icon}
          <h3 className="font-semibold">{achievement.name}</h3>
        </div>
        {achievement.completed && (
          <Badge className="bg-green-500">Completed</Badge>
        )}
      </div>
      <p className="text-sm mb-3">{achievement.description}</p>
      <div className="flex items-center gap-2">
        <Progress value={achievement.progress} className="h-2" />
        <span className="text-xs font-medium">{achievement.progress}%</span>
      </div>
    </motion.div>
  );
};

export default AchievementItem;
