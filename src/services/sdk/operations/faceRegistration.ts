
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
    // Verificar se a imagem é válida
    const detectionResult = await detectFace(imageData, isInitialized, apiBaseURL, apiKey);
    if (!detectionResult.success) {
      console.error("Não foi possível detectar um rosto válido para registro");
      return false;
    }
    
    // Em produção, aqui seria uma chamada à API real para registrar o rosto
    // Para esta versão, simulamos o registro armazenando na tabela face_registrations
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado para registro facial");
      return false;
    }
    
    // Define register_face parameters interface
    interface RegisterFaceParams {
      user_id_param: string;
      face_id_param: string;
      confidence_param: number;
      status_param: string;
    }
    
    // Fix: Use the correct approach to insert data
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
