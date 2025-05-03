
import React from "react";
import { Settings, Shield, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfilePageHeaderProps {
  openSettings: (section?: string) => void;
  isOwner?: boolean;
}

const ProfilePageHeader: React.FC<ProfilePageHeaderProps> = ({ openSettings, isOwner = true }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b sticky top-0 z-10">
      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        {isOwner ? "Seu Perfil" : "Perfil"}
      </h1>
      <div className="flex gap-2">
        {isOwner && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/edit-profile">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Edit className="h-5 w-5 text-blue-500" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar Perfil</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings" onClick={() => openSettings("profile-visibility")}>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Privacidade</p>
              </TooltipContent>
            </Tooltip>
            
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5 text-gray-500" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default ProfilePageHeader;
