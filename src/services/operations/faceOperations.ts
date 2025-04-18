
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../sdk/initializeSDK";
import type { FaceMatchResult } from "../sdk/FacialRecognitionSDK";

export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResult | null> => {
  try {
    const sdk = await getFacialRecognitionSDK();
    
    // Step 1: Enhanced face detection with stricter confidence threshold
    const detectionResult = await sdk.detectFace(imageData);
    if (!detectionResult.success || !detectionResult.faceId) {
      console.error("Face detection failed:", detectionResult.error);
      toast.error("Não foi possível detectar um rosto na imagem");
      return null;
    }
    
    // Provide more specific feedback based on detection confidence
    if (detectionResult.confidence < 0.6) {
      toast.error("Qualidade da imagem muito baixa. Tente em um ambiente mais iluminado.");
      return null;
    } else if (detectionResult.confidence < 0.7) {
      toast.warning("Qualidade da imagem não é ideal. Tente novamente com melhor iluminação.");
    } else if (detectionResult.confidence > 0.9) {
      toast.success("Qualidade da imagem excelente!");
    }
    
    // Step 2: Enhanced face matching with confidence threshold
    const matchResult = await sdk.matchFace(detectionResult.faceId);
    
    if (!matchResult.success) {
      toast.error("Erro ao procurar correspondências");
      return null;
    }
    
    // Filter matches with low confidence
    if (matchResult.matches.length > 0) {
      matchResult.matches = matchResult.matches
        .filter(match => match.confidence > 0.75) // Only keep high confidence matches
        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
        .map(match => ({
          ...match,
          avatar: imageData
        }));
      
      if (matchResult.matches.length > 0) {
        const bestMatch = matchResult.matches[0];
        if (bestMatch.confidence > 0.9) {
          toast.success("Correspondência encontrada com alta confiança!");
        } else {
          toast.info("Possível correspondência encontrada");
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
    const sdk = await getFacialRecognitionSDK();
    
    // First verify the image quality through face detection
    const detectionResult = await sdk.detectFace(imageData);
    if (!detectionResult.success || detectionResult.confidence < 0.7) {
      toast.error("A qualidade da imagem não é boa o suficiente para registro");
      return false;
    }
    
    const success = await sdk.registerFace(imageData, userId);
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
