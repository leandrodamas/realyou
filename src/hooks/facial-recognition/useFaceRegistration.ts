
import { toast } from "sonner";
import { useImageUploader } from "./useImageUploader";
import { useProfileStorage } from "./useProfileStorage";

export const useFaceRegistration = () => {
  const { uploadProfileImage } = useImageUploader();
  const { saveProfile } = useProfileStorage();

  const registerFace = async (imageData: string, userId?: string) => {
    try {
      console.log("Starting face registration process");
      
      // Generate a temporary userId if none provided
      const tempUserId = userId || `temp_${Date.now()}`;
      console.log(`Using userId for registration: ${tempUserId}`);
      
      // Upload the image
      const publicUrl = await uploadProfileImage(imageData, tempUserId, 'face_registration');
      
      if (!publicUrl) {
        throw new Error("Falha ao fazer upload da imagem");
      }
      
      console.log("Image uploaded successfully, URL:", publicUrl);
      
      // Save information to local profile
      saveProfile({
        userId: tempUserId,
        profileImage: imageData, // Store base64 in localStorage for quick access
        serverImage: publicUrl,  // Store server URL for reference
        faceRegistered: true,
        registrationTimestamp: new Date().toISOString()
      });
      
      console.log("Profile saved to localStorage");
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
