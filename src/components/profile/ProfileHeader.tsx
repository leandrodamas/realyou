
import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProfileHeaderProps {
  name: string;
  title: string;
  avatar: string;
  postCount: number;
  connectionCount: number;
  skillsCount: number;
  isOwner?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  avatar,
  postCount,
  connectionCount,
  skillsCount,
  isOwner = true
}) => {
  const handleUploadPhoto = () => {
    // Aqui seria implementada a lógica para upload de foto
    if (isOwner) {
      toast.info("Funcionalidade de upload de foto será implementada em breve");
    }
  };

  return (
    <div className="py-4 px-4">
      <div className="relative mb-6">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl"></div>
        {isOwner && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-2 right-2 rounded-full"
            onClick={() => toast.info("Funcionalidade de upload de capa será implementada em breve")}
          >
            <PencilLine className="h-4 w-4 mr-1" />
            Capa
          </Button>
        )}
        
        <div className="absolute -bottom-12 left-4 flex items-end">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg" onClick={isOwner ? handleUploadPhoto : undefined}>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-blue-500">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOwner && (
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 shadow-sm"
                onClick={handleUploadPhoto}
              >
                <PencilLine className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <div className="flex justify-between items-start">
          <div>
            <motion.h1 
              className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {name}
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.p>
          </div>
          {isOwner && (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full border-purple-200"
              onClick={() => toast.info("Edição de perfil será implementada em breve")}
            >
              <PencilLine className="h-4 w-4 mr-1" />
              Editar perfil
            </Button>
          )}
        </div>
        
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
      </div>
    </div>
  );
};

export default ProfileHeader;
