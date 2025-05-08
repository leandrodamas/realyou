
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../../sdk/initializeSDK";
import type { FaceMatchResult } from "../../sdk/types/interfaces";
import { getMatchConfidenceThreshold, isMobileDevice } from "./deviceDetector";

/**
 * Finds face matches based on a faceId
 */
export const findFaceMatches = async (faceId: string): Promise<FaceMatchResult | null> => {
  try {
    const sdk = await getFacialRecognitionSDK();
    
    // Find matches based on profile photo
    const matchResult = await sdk.matchFace(faceId);
    
    if (!matchResult.success) {
      toast.error("Erro ao procurar correspondências");
      return null;
    }
    
    // Filter matches by confidence threshold
    if (matchResult.matches.length > 0) {
      matchResult.matches = matchResult.matches
        .filter(match => match.confidence > getMatchConfidenceThreshold())
        .sort((a, b) => b.confidence - a.confidence);
      
      // Show appropriate notifications based on match confidence
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
    console.error("Error in face matching service:", error);
    return null;
  }
};
