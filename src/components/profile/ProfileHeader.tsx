
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, Link as LinkIcon } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  title: string;
  avatar: string;
  postCount: number;
  connectionCount: number;
  skillsCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  avatar,
  postCount,
  connectionCount,
  skillsCount,
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar className="h-20 w-20">
              <img src={avatar} alt={name} className="object-cover" />
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-500">{title}</p>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon">
            <LinkIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-around mt-6 text-center">
        <div>
          <p className="font-bold">{postCount}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div>
          <p className="font-bold">{connectionCount}</p>
          <p className="text-xs text-gray-500">Connections</p>
        </div>
        <div>
          <p className="font-bold">{skillsCount}</p>
          <p className="text-xs text-gray-500">Skills</p>
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <Button className="flex-1 bg-whatsapp hover:bg-whatsapp-dark">
          <MessageSquare className="mr-2 h-4 w-4" /> Message
        </Button>
        <Button variant="outline" className="flex-1">
          <UserPlus className="mr-2 h-4 w-4" /> Connect
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
