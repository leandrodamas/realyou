
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../../sdk/initializeSDK";
import { enhanceImageBrightness, resizeImageForMobile } from "./imageOptimizer";
import { isMobileDevice } from "./deviceDetector";

/**
 * Registers a face for a user
 */
export const registerFace = async (imageData: string, userId: string): Promise<boolean> => {
  try {
    // Enhance image quality before processing
    const enhancedImage = await enhanceImageBrightness(imageData);
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Check image quality with adjusted threshold for mobile
    const qualityThreshold = isMobileDevice() ? 0.5 : 0.7;
    const detectionResult = await sdk.detectFace(optimizedImageData);
    
    if (!detectionResult.success || detectionResult.confidence < qualityThreshold) {
      if (detectionResult.confidence < qualityThreshold && detectionResult.confidence > 0.3) {
        toast.warning("Qualidade da foto não é ideal, mas tentaremos registrar");
      } else {
        toast.error("A qualidade da foto não é boa o suficiente para registro");
        return false;
      }
    }
    
    // Register the profile photo
    const success = await sdk.registerFace(optimizedImageData, userId);
    if (success) {
      toast.success("Foto de perfil registrada com sucesso!");
    } else {
      toast.error("Não foi possível registrar a foto de perfil");
    }
    
    return success;
  } catch (error) {
    console.error("Error registering profile photo:", error);
    toast.error("Erro ao registrar foto de perfil");
    return false;
  }
};
