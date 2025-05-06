
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface AchievementsTabProps {
  isOwner: boolean;
  openSettings: (section?: string) => void;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ isOwner, openSettings }) => {
  return (
    <TabsContent value="achievements" className="px-4 animate-fade-in">
      <ProfileAchievements />
      
      {isOwner && (
        <div className="mt-4 flex justify-end">
          <Link to="/settings" onClick={() => openSettings("achievements")}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Gerenciar Visibilidade das Conquistas
            </Button>
          </Link>
        </div>
      )}
    </TabsContent>
  );
};

export default AchievementsTab;
