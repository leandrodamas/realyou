
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useProfileImageUpload } from "@/hooks/useProfileImageUpload";

interface ProfileImageUploadProps {
  profileImage: string | null;
  fullName: string;
  onChange: (imageData: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profileImage,
  fullName,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfileImage, isUploading } = useProfileImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Image size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter menos de 5MB");
        return;
      }

      try {
        // Primeiro, converta para data URL para preview imediato
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageDataUrl = reader.result as string;
          onChange(imageDataUrl); // Update UI immediately with preview
        };
        reader.readAsDataURL(file);

        // Em segundo plano, faça o upload para Supabase
        const publicUrl = await uploadProfileImage(file);
        if (publicUrl) {
          // Se quiser atualizar com a URL pública depois
          // onChange(publicUrl);
          toast.success("Foto de perfil enviada ao servidor!");
        }
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        toast.error("Não foi possível processar a imagem");
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Foto de Perfil
      </label>
      <div className="flex items-center space-x-3">
        {profileImage ? (
          <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
            <AvatarImage src={profileImage} alt="Perfil" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {fullName ? fullName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <Camera className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden" 
          onChange={handleFileChange}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Enviando..." : (profileImage ? "Alterar Foto" : "Fazer Upload")}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Uma boa foto de perfil aumenta as chances de conexões em 80%
      </p>
    </div>
  );
};

export default ProfileImageUpload;
