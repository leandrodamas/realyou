
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilLine, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";

interface ProfileHeaderProps {
  name: string;
  title: string;
  avatar: string;
  coverImage?: string;
  postCount: number;
  connectionCount: number;
  skillsCount: number;
  isOwner?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  avatar,
  coverImage,
  postCount,
  connectionCount,
  skillsCount,
  isOwner = true
}) => {
  const [editProfile, setEditProfile] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedBio, setEditedBio] = useState("");
  const { saveProfile, getProfile, uploadProfileImage, uploadCoverImage } = useProfileStorage();
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const handleProfilePhotoUpload = () => {
    if (isOwner && profileInputRef.current) {
      profileInputRef.current.click();
    }
  };
  
  const handleCoverPhotoUpload = () => {
    if (isOwner && coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      toast.loading("Enviando foto...");
      
      const imageUrl = await uploadProfileImage(file);
      if (!imageUrl) throw new Error("Falha ao fazer upload da imagem");
      
      const currentProfile = getProfile() || {};
      const updatedProfile = {
        ...currentProfile,
        profileImage: imageUrl
      };
      
      saveProfile(updatedProfile);
      toast.success("Foto de perfil atualizada com sucesso!");
      
      // Dispatch event to notify other components about the profile update
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: updatedProfile } 
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      toast.error("Não foi possível atualizar sua foto de perfil");
    }
  };
  
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      toast.loading("Enviando imagem de capa...");
      
      const imageUrl = await uploadCoverImage(file);
      if (!imageUrl) throw new Error("Falha ao fazer upload da imagem de capa");
      
      const currentProfile = getProfile() || {};
      const updatedProfile = {
        ...currentProfile,
        coverImage: imageUrl
      };
      
      saveProfile(updatedProfile);
      toast.success("Imagem de capa atualizada com sucesso!");
      
      // Dispatch event to notify other components about the profile update
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: updatedProfile } 
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error("Erro ao atualizar imagem de capa:", error);
      toast.error("Não foi possível atualizar sua imagem de capa");
    }
  };

  const handleSaveProfile = () => {
    try {
      const currentProfile = getProfile() || {};
      const updatedProfile = {
        ...currentProfile,
        fullName: editedName,
        title: editedTitle,
        bio: editedBio
      };
      
      saveProfile(updatedProfile);
      toast.success("Perfil atualizado com sucesso!");
      setEditProfile(false);
      
      // Dispatch event to notify other components about the profile update
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: updatedProfile } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Não foi possível atualizar seu perfil");
    }
  };

  return (
    <div className="py-4 px-4">
      <div className="relative mb-6">
        <div 
          className="h-32 rounded-xl bg-cover bg-center"
          style={{ 
            backgroundImage: coverImage ? `url(${coverImage})` : 'linear-gradient(to right, #9333ea, #3b82f6)'
          }}
        >
          {isOwner && (
            <input 
              type="file"
              ref={coverInputRef}
              onChange={handleCoverImageChange}
              className="hidden"
              accept="image/*"
            />
          )}
        </div>
        
        {isOwner && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-2 right-2 rounded-full"
            onClick={handleCoverPhotoUpload}
          >
            <Camera className="h-4 w-4 mr-1" />
            Capa
          </Button>
        )}
        
        <div className="absolute -bottom-12 left-4 flex items-end">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg" onClick={isOwner ? handleProfilePhotoUpload : undefined}>
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
                  onChange={handleProfileImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 shadow-sm"
                  onClick={handleProfilePhotoUpload}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
              </>
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
            <Sheet open={editProfile} onOpenChange={setEditProfile}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border-purple-200"
                >
                  <PencilLine className="h-4 w-4 mr-1" />
                  Editar perfil
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Editar Perfil</SheetTitle>
                  <SheetDescription>
                    Atualize suas informações de perfil aqui. Clique em salvar quando terminar.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título Profissional</Label>
                    <Input 
                      id="title" 
                      value={editedTitle} 
                      onChange={(e) => setEditedTitle(e.target.value)} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={editedBio} 
                      onChange={(e) => setEditedBio(e.target.value)} 
                      placeholder="Escreva sobre você e seu trabalho"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
                </div>
              </SheetContent>
            </Sheet>
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
