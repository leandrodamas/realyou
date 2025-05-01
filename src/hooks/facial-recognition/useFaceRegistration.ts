
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useImageUploader } from "./useImageUploader";
import { useProfileStorage } from "./useProfileStorage";

export const useFaceRegistration = () => {
  const { uploadProfileImage } = useImageUploader();
  const { saveProfile } = useProfileStorage();

  const registerFace = async (imageData: string, userId?: string) => {
    try {
      // Obter ID do usuário atual se não fornecido
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }
      
      if (!userId) {
        toast.error("Necessário estar logado para registrar face");
        return false;
      }
      
      // Upload da imagem
      const publicUrl = await uploadProfileImage(imageData, userId, 'face_registration');
      
      if (!publicUrl) {
        throw new Error("Falha ao fazer upload da imagem");
      }
      
      // Salvar informações no perfil local
      saveProfile({
        userId,
        profileImage: publicUrl,
        faceRegistered: true,
        registrationTimestamp: new Date().toISOString()
      });
      
      toast.success("Face registrada com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao registrar face:", error);
      toast.error("Não foi possível registrar seu reconhecimento facial");
      return false;
    }
  };

  return { registerFace };
};
