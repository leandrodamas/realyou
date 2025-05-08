
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../../sdk/initializeSDK";
import type { FaceMatchResult } from "../../sdk/types/interfaces";
import { resizeImageForMobile, enhanceImageBrightness } from "./imageOptimizer";
import { isMobileDevice, getDeviceConfidenceThreshold, getMatchConfidenceThreshold } from "./deviceDetector";

/**
 * Detects a face in an image and returns quality feedback
 */
export const detectFace = async (imageData: string) => {
  try {
    // Optimize image quality
    const enhancedImage = await enhanceImageBrightness(imageData);
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Profile photo analysis
    const detectionResult = await sdk.detectFace(optimizedImageData);
    if (!detectionResult.success || !detectionResult.faceId) {
      console.error("Profile photo analysis failed:", detectionResult.error);
      return {
        success: false,
        error: detectionResult.error || "Não foi possível analisar a foto",
        imageData: optimizedImageData
      };
    }
    
    // Quality feedback based on confidence
    const confidenceThreshold = getDeviceConfidenceThreshold();
    let qualityFeedback = "";
    
    if (!isMobileDevice()) {
      if (detectionResult.confidence < confidenceThreshold) {
        qualityFeedback = "low";
      } else if (detectionResult.confidence < 0.7) {
        qualityFeedback = "medium";
      } else if (detectionResult.confidence > 0.9) {
        qualityFeedback = "excellent";
      } else {
        qualityFeedback = "good";
      }
    }
    
    return {
      success: true,
      faceId: detectionResult.faceId,
      confidence: detectionResult.confidence,
      qualityFeedback,
      imageData: optimizedImageData
    };
  } catch (error) {
    console.error("Error in face detection service:", error);
    return {
      success: false,
      error: "Erro no processo de detecção facial",
      imageData: imageData
    };
  }
};
