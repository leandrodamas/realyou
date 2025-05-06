
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import CoverImageSection from "./header/CoverImageSection";
import AvatarSection from "./header/AvatarSection";
import ProfileInfo from "./header/ProfileInfo";
import ProfileStats from "./header/ProfileStats";
import ProfileEditSheet from "./header/ProfileEditSheet";

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
  const { saveProfile, getProfile, uploadProfileImage, uploadCoverImage } = useProfileStorage();
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const handleProfilePhotoUpload = () => {
    if (isOwner && profileInputRef.current && !isUploadingAvatar) {
      profileInputRef.current.click();
    }
  };
  
  const handleCoverPhotoUpload = () => {
    if (isOwner && coverInputRef.current && !isUploadingCover) {
      coverInputRef.current.click();
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploadingAvatar(true);
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
    } finally {
      setIsUploadingAvatar(false);
    }
  };
  
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploadingCover(true);
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
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSaveProfile = (editedName: string, editedTitle: string, editedBio: string) => {
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
    <div className="py-4 px-4 animate-fade-in">
      <div className="relative mb-6">
        <CoverImageSection 
          coverImage={coverImage}
          isOwner={isOwner}
          onCoverPhotoUpload={handleCoverPhotoUpload}
          coverInputRef={coverInputRef}
          onCoverImageChange={handleCoverImageChange}
          isUploading={isUploadingCover}
        />
        
        <div className="absolute -bottom-12 left-4 flex items-end">
          <AvatarSection 
            avatar={avatar}
            name={name}
            isOwner={isOwner}
            onAvatarClick={handleProfilePhotoUpload}
            profileInputRef={profileInputRef}
            onProfileImageChange={handleProfileImageChange}
            isUploading={isUploadingAvatar}
          />
        </div>
      </div>
      
      <div className="mt-12">
        <div className="flex justify-between items-start">
          <ProfileInfo name={name} title={title} />
          
          {isOwner && (
            <ProfileEditSheet 
              name={name}
              title={title}
              onSave={handleSaveProfile}
            />
          )}
        </div>
        
        <ProfileStats 
          postCount={postCount}
          connectionCount={connectionCount}
          skillsCount={skillsCount}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
