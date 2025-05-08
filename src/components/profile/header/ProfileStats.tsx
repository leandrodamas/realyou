
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileStatsProps {
  postCount: number;
  connectionCount: number;
  skillsCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  postCount,
  connectionCount,
  skillsCount
}) => {
  const [stats, setStats] = useState({
    postCount: postCount,
    connectionCount: connectionCount,
    skillsCount: skillsCount
  });
  
  useEffect(() => {
    const loadRealStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        // Aqui poderíamos carregar contagens reais da base de dados
        // Por enquanto, vamos usar os valores passados por props
        setStats({
          postCount: postCount,
          connectionCount: connectionCount,
          skillsCount: skillsCount
        });
        
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    };
    
    loadRealStats();
  }, [postCount, connectionCount, skillsCount]);
  
  return (
    <div className="flex mt-4 space-x-6">
      <div className="text-center">
        <p className="font-bold text-gray-800">{stats.postCount}</p>
        <p className="text-sm text-gray-500">Publicações</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800">{stats.connectionCount}</p>
        <p className="text-sm text-gray-500">Conexões</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800">{stats.skillsCount}</p>
        <p className="text-sm text-gray-500">Habilidades</p>
      </div>
    </div>
  );
};

export default ProfileStats;
