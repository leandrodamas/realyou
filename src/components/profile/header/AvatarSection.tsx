
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";

interface AvatarSectionProps {
  avatar: string;
  name: string;
  isOwner: boolean;
  onAvatarClick: () => void;
  profileInputRef: React.RefObject<HTMLInputElement>;
  onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatar,
  name,
  isOwner,
  onAvatarClick,
  profileInputRef,
  onProfileImageChange
}) => {
  return (
    <div className="relative">
      <Avatar 
        className="h-24 w-24 border-4 border-white shadow-lg" 
        onClick={isOwner ? onAvatarClick : undefined}
      >
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-blue-500">
          {name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {isOwner && (
        <>
          <input 
            type="file"
            ref={profileInputRef}
            onChange={onProfileImageChange}
            className="hidden"
            accept="image/*"
          />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 shadow-sm"
            onClick={onAvatarClick}
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default AvatarSection;
