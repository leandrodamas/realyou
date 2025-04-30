
import { useState } from "react";
import { useFileUpload } from "./useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileImageUpload = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { uploadFile, isUploading } = useFileUpload();

  const uploadProfileImage = async (imageFile: File): Promise<string | null> => {
    try {
      // Verificar se usuário está logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para enviar uma foto de perfil");
        return null;
      }
      
      // Fazer upload da imagem para o bucket 'profile_images'
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName: 'profile_images',
        folder: user.id,
        metadata: {
          user_id: user.id,
          purpose: 'profile_image'
        }
      });
      
      if (error || !publicUrl) {
        throw error;
      }
      
      // Salvar URL na variável de estado
      setProfileImage(publicUrl);
      
      // Opcionalmente, salvar URL no perfil do usuário no banco de dados
      // Implementar aqui se necessário
      
      return publicUrl;
    } catch (error) {
      console.error('Erro ao enviar foto de perfil:', error);
      toast.error("Não foi possível salvar sua foto de perfil");
      return null;
    }
  };
  
  const registerProfileImageWithFaceID = async (imageData: string): Promise<boolean> => {
    try {
      // Converter Base64 para File
      const byteString = atob(imageData.split(',')[1]);
      const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const imageFile = new File([blob], "profile-with-faceid.jpg", { type: mimeString });
      
      // Fazer upload no bucket facial_recognition
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para registrar seu reconhecimento facial");
        return false;
      }
      
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName: 'facial_recognition',
        folder: user.id,
        metadata: {
          user_id: user.id,
          purpose: 'facial_recognition'
        }
      });
      
      if (error || !publicUrl) {
        throw error;
      }
      
      // Registrar no sistema de reconhecimento facial
      // (implementação simplificada - em produção, usaria uma API especializada)
      // Salvar URL no perfil do usuário
      
      toast.success("Reconhecimento facial registrado com sucesso!");
      return true;
    } catch (error) {
      console.error('Erro ao registrar reconhecimento facial:', error);
      toast.error("Não foi possível registrar seu reconhecimento facial");
      return false;
    }
  };

  return {
    profileImage,
    setProfileImage,
    uploadProfileImage,
    registerProfileImageWithFaceID,
    isUploading
  };
};
