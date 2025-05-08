
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Medal, Star, Crown, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: number;
  name: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  completed?: boolean;
}

const ProfileAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { 
      id: 1, 
      name: "Content Creator", 
      description: "Posted 100+ quality content pieces", 
      progress: 0, 
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-100 text-amber-700 border-amber-200"
    },
    { 
      id: 2, 
      name: "Social Butterfly", 
      description: "Connected with 250+ people", 
      progress: 0, 
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    { 
      id: 3, 
      name: "Skill Master", 
      description: "Verified expert in 10+ skills", 
      progress: 0, 
      icon: <Award className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    { 
      id: 4, 
      name: "Rising Star", 
      description: "Gained 1000+ profile views", 
      progress: 0, 
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200"
    },
    { 
      id: 5, 
      name: "Consistent Creator", 
      description: "Posted content for 30 days in a row", 
      progress: 0, 
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-100 text-orange-700 border-orange-200"
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        // Configurar progresso inicial baseado em atividades do usuário
        // Em uma implementação real, isso viria do banco de dados
        
        // Por enquanto, vamos definir valores iniciais baixos para mostrar progresso
        setAchievements(prevAchievements => 
          prevAchievements.map(achievement => ({
            ...achievement,
            progress: Math.floor(Math.random() * 25) // 0-25% de progresso para começar
          }))
        );
        
      } catch (error) {
        console.error("Erro ao carregar conquistas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, []);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-20 bg-gray-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

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
