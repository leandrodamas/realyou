
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
      
      // Upload the image - try 3 times with backoff
      let publicUrl = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!publicUrl && attempts < maxAttempts) {
        attempts++;
        try {
          console.log(`Upload attempt ${attempts} of ${maxAttempts}`);
          publicUrl = await uploadProfileImage(imageData, tempUserId, 'face_registration');
          
          if (!publicUrl) {
            console.error(`Attempt ${attempts} failed: No URL returned`);
            // If this isn't the last attempt, wait before retrying
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
          }
        } catch (uploadError) {
          console.error(`Attempt ${attempts} failed with error:`, uploadError);
          // If this isn't the last attempt, wait before retrying
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          }
        }
      }
      
      if (!publicUrl) {
        console.error(`All ${maxAttempts} upload attempts failed`);
        throw new Error("Falha ao fazer upload da imagem após várias tentativas");
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
