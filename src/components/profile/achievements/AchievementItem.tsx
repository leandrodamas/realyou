
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Medal, Star, Crown, Flame } from "lucide-react";
import { Achievement } from "./types";

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const renderIcon = () => {
    switch (achievement.iconName) {
      case "Trophy":
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case "Award":
        return <Award className="h-5 w-5 text-blue-500" />;
      case "Medal":
        return <Medal className="h-5 w-5 text-green-500" />;
      case "Star":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "Crown":
        return <Crown className="h-5 w-5 text-purple-500" />;
      case "Flame":
        return <Flame className="h-5 w-5 text-orange-500" />;
      default:
        return <Trophy className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      key={achievement.id}
      className={`p-4 rounded-xl border ${achievement.color || 'bg-gray-100 border-gray-200'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {renderIcon()}
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
