
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Medal, Star, Crown, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
  const { user } = useAuth();

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load work gallery items count (for Content Creator achievement)
        const { data: galleryData, error: galleryError } = await supabase
          .from('work_gallery')
          .select('id')
          .eq('user_id', user.id);
          
        if (galleryError) throw galleryError;
        
        // Load service bookings count (for Social Butterfly achievement)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('id')
          .eq('provider_id', user.id);
          
        if (bookingsError) throw bookingsError;
        
        // Calculate achievement progress based on actual data
        setAchievements(prev => {
          return prev.map(achievement => {
            let progress = 0;
            let completed = false;
            
            switch(achievement.id) {
              case 1: // Content Creator
                const postCount = galleryData?.length || 0;
                progress = Math.min(Math.round((postCount / 100) * 100), 100);
                completed = progress >= 100;
                break;
                
              case 2: // Social Butterfly
                const connectionCount = bookingsData?.length || 0;
                progress = Math.min(Math.round((connectionCount / 250) * 100), 100);
                completed = progress >= 100;
                break;
                
              case 3: // Skill Master
                // For demo purposes we'll set a random progress
                // In a real app, you would fetch this from a skills table
                progress = Math.floor(Math.random() * 70) + 10;
                completed = progress >= 100;
                break;
                
              case 4: // Rising Star
                // Simulate view count based on bookings * 10 for now
                const viewCount = (bookingsData?.length || 0) * 10;
                progress = Math.min(Math.round((viewCount / 1000) * 100), 100);
                completed = progress >= 100;
                break;
                
              case 5: // Consistent Creator
                // For now, set a random progress
                // In a real app, you would calculate streak days
                progress = Math.floor(Math.random() * 50) + 20;
                completed = progress >= 100;
                break;
                
              default:
                progress = Math.floor(Math.random() * 60) + 10;
                completed = progress >= 100;
            }
            
            return {
              ...achievement,
              progress,
              completed
            };
          });
        });
      } catch (error) {
        console.error("Error loading achievements:", error);
        toast.error("Não foi possível carregar suas conquistas");
        
        // Set fallback random progress values
        setAchievements(prev => prev.map(achievement => ({
          ...achievement,
          progress: Math.floor(Math.random() * 70) + 10
        })));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, [user]);

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
