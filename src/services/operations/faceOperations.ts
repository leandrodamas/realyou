
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../sdk/initializeSDK";
import type { FaceMatchResult } from "../sdk/FacialRecognitionSDK";
import { resizeImageForMobile, enhanceImageBrightness } from "./utils/imageOptimizer";
import { isMobileDevice, getDeviceConfidenceThreshold, getMatchConfidenceThreshold } from "./utils/deviceDetector";

export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResult | null> => {
  try {
    // Melhorar a imagem antes de processar
    const enhancedImage = await enhanceImageBrightness(imageData);
    
    // Então redimensionar para dispositivos móveis
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Step 1: Enhanced face detection with stricter confidence threshold
    const detectionResult = await sdk.detectFace(optimizedImageData);
    if (!detectionResult.success || !detectionResult.faceId) {
      console.error("Face detection failed:", detectionResult.error);
      toast.error(isMobileDevice() ? 
        "Não foi possível detectar um rosto" : 
        "Não foi possível detectar um rosto na imagem"
      );
      return null;
    }
    
    // Ajustar feedback baseado na confiança
    const confidenceThreshold = getDeviceConfidenceThreshold();
    if (!isMobileDevice()) {
      if (detectionResult.confidence < confidenceThreshold) {
        toast.error("Qualidade da imagem muito baixa. Tente em um ambiente mais iluminado.");
        return null;
      } else if (detectionResult.confidence < 0.7) {
        toast.warning("Qualidade da imagem não é ideal. Tente novamente com melhor iluminação.");
      } else if (detectionResult.confidence > 0.9) {
        toast.success("Qualidade da imagem excelente!");
      }
    }
    
    // Step 2: Enhanced face matching
    const matchResult = await sdk.matchFace(detectionResult.faceId);
    
    if (!matchResult.success) {
      toast.error("Erro ao procurar correspondências");
      return null;
    }
    
    // Filter matches with low confidence
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
    console.error("Error in facial recognition process:", error);
    toast.error("Erro no processo de reconhecimento facial");
    return null;
  }
};

export const registerFaceForUser = async (imageData: string, userId: string): Promise<boolean> => {
  try {
    // Melhorar a imagem antes de processar
    const enhancedImage = await enhanceImageBrightness(imageData);
    
    // Então redimensionar para dispositivos móveis
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Verificar a qualidade da imagem com limiar ajustado para mobile
    const qualityThreshold = isMobileDevice() ? 0.5 : 0.7;
    const detectionResult = await sdk.detectFace(optimizedImageData);
    
    if (!detectionResult.success || detectionResult.confidence < qualityThreshold) {
      if (detectionResult.confidence < qualityThreshold && detectionResult.confidence > 0.3) {
        toast.warning("Qualidade da imagem não é ideal, mas tentaremos registrar");
      } else {
        toast.error("A qualidade da imagem não é boa o suficiente para registro");
        return false;
      }
    }
    
    const success = await sdk.registerFace(optimizedImageData, userId);
    if (success) {
      toast.success("Rosto registrado com sucesso!");
    } else {
      toast.error("Não foi possível registrar o rosto");
    }
    
    return success;
  } catch (error) {
    console.error("Error registering face:", error);
    toast.error("Erro ao registrar rosto");
    return false;
  }
};
