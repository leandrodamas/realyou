
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../sdk/initializeSDK";
import type { FaceMatchResult } from "../sdk/FacialRecognitionSDK";
import { resizeImageForMobile, enhanceImageBrightness } from "./utils/imageOptimizer";
import { isMobileDevice, getDeviceConfidenceThreshold, getMatchConfidenceThreshold } from "./utils/deviceDetector";

export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResult | null> => {
  try {
    // Optimize image quality
    const enhancedImage = await enhanceImageBrightness(imageData);
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Profile photo analysis instead of real-time face detection
    const detectionResult = await sdk.detectFace(optimizedImageData);
    if (!detectionResult.success || !detectionResult.faceId) {
      console.error("Profile photo analysis failed:", detectionResult.error);
      toast.error("Não foi possível analisar a foto de perfil");
      return null;
    }
    
    // Quality feedback based on confidence
    const confidenceThreshold = getDeviceConfidenceThreshold();
    if (!isMobileDevice()) {
      if (detectionResult.confidence < confidenceThreshold) {
        toast.error("Qualidade da imagem muito baixa. Use uma foto com melhor iluminação.");
        return null;
      } else if (detectionResult.confidence < 0.7) {
        toast.warning("Qualidade da foto não é ideal. Considere usar uma foto com melhor iluminação.");
      } else if (detectionResult.confidence > 0.9) {
        toast.success("Qualidade da foto excelente!");
      }
    }
    
    // Find matches based on profile photo
    const matchResult = await sdk.matchFace(detectionResult.faceId);
    
    if (!matchResult.success) {
      toast.error("Erro ao procurar correspondências");
      return null;
    }
    
    // Filter matches by confidence threshold
    if (matchResult.matches.length > 0) {
      matchResult.matches = matchResult.matches
        .filter(match => match.confidence > getMatchConfidenceThreshold())
        .sort((a, b) => b.confidence - a.confidence)
        .map(match => ({
          ...match,
          avatar: optimizedImageData
        }));
      
      if (matchResult.matches.length > 0) {
        const bestMatch = matchResult.matches[0];
        if (!isMobileDevice()) {
          if (bestMatch.confidence > 0.9) {
            toast.success("Correspondência encontrada com alta confiança!");
          } else {
            toast.info("Possível correspondência encontrada");
          }
        }
      }
    }
    
    return matchResult;
  } catch (error) {
    console.error("Error in profile photo analysis:", error);
    toast.error("Erro no processo de análise de foto");
    return null;
  }
};

export const registerFaceForUser = async (imageData: string, userId: string): Promise<boolean> => {
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
