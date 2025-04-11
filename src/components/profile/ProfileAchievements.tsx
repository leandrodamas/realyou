
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Medal, Star, Crown, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const achievements = [
  { 
    id: 1, 
    name: "Content Creator", 
    description: "Posted 100+ quality content pieces", 
    progress: 75, 
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    color: "bg-amber-100 text-amber-700 border-amber-200"
  },
  { 
    id: 2, 
    name: "Social Butterfly", 
    description: "Connected with 250+ people", 
    progress: 68, 
    icon: <Crown className="h-5 w-5 text-purple-500" />,
    color: "bg-purple-100 text-purple-700 border-purple-200"
  },
  { 
    id: 3, 
    name: "Skill Master", 
    description: "Verified expert in 10+ skills", 
    progress: 100, 
    icon: <Award className="h-5 w-5 text-blue-500" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    completed: true
  },
  { 
    id: 4, 
    name: "Rising Star", 
    description: "Gained 1000+ profile views", 
    progress: 92, 
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  { 
    id: 5, 
    name: "Consistent Creator", 
    description: "Posted content for 30 days in a row", 
    progress: 40, 
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    color: "bg-orange-100 text-orange-700 border-orange-200"
  },
];

const ProfileAchievements: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          variants={item}
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
      ))}
    </motion.div>
  );
};

export default ProfileAchievements;
