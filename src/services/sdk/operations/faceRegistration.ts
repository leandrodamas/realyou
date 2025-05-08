
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
    
    // Use RPC to insert into face_registrations
    const { error } = await supabase.rpc('register_face', {
      user_id_param: userId,
      face_id_param: detectionResult.faceId || '',
      confidence_param: detectionResult.confidence || 0.75,
      status_param: 'active'
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
