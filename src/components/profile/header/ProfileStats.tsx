
import React from "react";

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
  return (
    <div className="flex mt-4 space-x-6">
      <div className="text-center">
        <p className="font-bold text-gray-800">{postCount}</p>
        <p className="text-sm text-gray-500">Publicações</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800">{connectionCount}</p>
        <p className="text-sm text-gray-500">Conexões</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800">{skillsCount}</p>
        <p className="text-sm text-gray-500">Habilidades</p>
      </div>
    </div>
  );
};

export default ProfileStats;
