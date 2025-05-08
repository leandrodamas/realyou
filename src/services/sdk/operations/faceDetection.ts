
import { supabase } from "@/integrations/supabase/client";
import { FaceDetectionResult } from "../types/interfaces";
import { localDetectFace } from "../utils/imageProcessing";

/**
 * Detect faces in provided image data
 */
export async function detectFace(
  imageData: string, 
  isInitialized: boolean,
  apiBaseURL: string,
  apiKey: string
): Promise<FaceDetectionResult> {
  if (!isInitialized) {
    return { success: false, confidence: 0, error: "SDK não inicializado" };
  }

  try {
    // Verificar se a string da imagem é válida
    if (!imageData || typeof imageData !== 'string') {
      return { success: false, confidence: 0, error: "Dados de imagem inválidos" };
    }
    
    // Processamento local para reduzir dependência de API
    const isFaceDetected = await localDetectFace(imageData);
    
    if (!isFaceDetected) {
      return { success: false, confidence: 0, error: "Nenhum rosto detectado" };
    }
    
    const faceId = `face-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const confidence = 0.85; // Valor fixo para alta confiança
    
    return { success: true, confidence, faceId };
  } catch (error) {
    console.error("Erro na detecção facial:", error);
    return { success: false, confidence: 0, error: "Erro no processamento da imagem" };
  }
}
