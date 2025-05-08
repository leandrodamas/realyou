
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
    console.error("SDK não inicializado para registro facial");
    return false;
  }

  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado para registro facial");
      return false;
    }
    
    // Verificar se a imagem é válida
    const detectionResult = await detectFace(imageData, isInitialized, apiBaseURL, apiKey);
    if (!detectionResult.success) {
      console.error("Não foi possível detectar um rosto válido para registro");
      return false;
    }
    
    // Inserir dados de registro facial
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
    
    // Atualizar o perfil do usuário, marcando que o rosto foi registrado
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        face_registered: true,
        face_registered_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error("Erro ao atualizar status de registro facial no perfil:", profileError);
      // Não impedimos o fluxo principal se a atualização do perfil falhar
    }
    
    console.log("Rosto registrado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro no registro facial:", error);
    return false;
  }
}
