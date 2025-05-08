
import { detectFace } from "./faceDetectionService";
import { findFaceMatches } from "./faceMatchingService";
import { registerFace } from "./faceRegistrationService";
import { toast } from "sonner";
import type { FaceMatchResult } from "../../sdk/types/interfaces";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

/**
 * Comprehensive service for detecting and matching faces
 */
export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResult | null> => {
  try {
    // Step 1: Detect face and get quality assessment
    const detectionResult = await detectFace(imageData);
    
    if (!detectionResult.success) {
      toast.error("Não foi possível analisar a foto de perfil");
      return null;
    }
    
    // Show quality feedback
    if (detectionResult.qualityFeedback === "low") {
      toast.error("Qualidade da imagem muito baixa. Use uma foto com melhor iluminação.");
      return null;
    } else if (detectionResult.qualityFeedback === "medium") {
      toast.warning("Qualidade da foto não é ideal. Considere usar uma foto com melhor iluminação.");
    } else if (detectionResult.qualityFeedback === "excellent") {
      toast.success("Qualidade da foto excelente!");
    }
    
    // Step 2: Find matches for the detected face
    const matchResult = await findFaceMatches(detectionResult.faceId);
    
    if (!matchResult) return null;
    
    // Update avatar in matches to optimized image if needed
    if (matchResult.matches.length > 0) {
      matchResult.matches = matchResult.matches.map(match => ({
        ...match,
        avatar: match.avatar || detectionResult.imageData
      }));
    }
    
    return matchResult;
  } catch (error) {
    console.error("Error in profile photo analysis:", error);
    toast.error("Erro no processo de análise de foto");
    return null;
  }
};

/**
 * Service for registering a face for a user
 */
export const registerFaceForUser = async (imageData: string, userId: string): Promise<boolean> => {
  return registerFace(imageData, userId);
};

// Export other utilities that might be needed elsewhere
export * from "./deviceDetector";
export * from "./imageOptimizer";
