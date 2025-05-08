
import { supabase } from "@/integrations/supabase/client";
import { detectFace } from "./faceDetection";

/**
 * Register a face in the system
 */
export async function registerFace(
  imageData: string,
  userId: string,
  isInitialized: boolean,
  apiBaseURL: string,
  apiKey: string
): Promise<boolean> {
  if (!isInitialized) {
    return false;
  }

  try {
    // Verify if the image is valid
    const detectionResult = await detectFace(imageData, isInitialized, apiBaseURL, apiKey);
    if (!detectionResult.success) {
      console.error("Não foi possível detectar um rosto válido para registro");
      return false;
    }
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado para registro facial");
      return false;
    }
    
    // Insert face registration data
    const { error } = await supabase
      .from('face_registrations')
      .insert({
        user_id: userId,
        face_id: detectionResult.faceId || '',
        confidence: detectionResult.confidence || 0.75,
        status: 'active'
      });
    
    if (error) {
      console.error("Erro ao registrar rosto no banco de dados:", error);
      return false;
    }
    
    console.log("Rosto registrado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro no registro facial:", error);
    return false;
  }
}
