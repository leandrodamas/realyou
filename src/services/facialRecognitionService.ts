
import { getFacialRecognitionSDK } from "./sdk/initializeSDK";
import type { FaceMatchResult } from "./sdk/types/interfaces";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";
import { supabase } from "@/integrations/supabase/client";

export interface FaceMatchResultExtended {
  matches: Array<MatchedPerson>;
  noMatch: boolean;
  errorMessage?: string;
}

// Função para detectar e buscar correspondência de rosto
export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResultExtended | null> => {
  try {
    // Inicializar o SDK
    const sdk = await getFacialRecognitionSDK();
    
    // Detectar rosto na imagem
    const detectionResult = await sdk.detectFace(imageData);
    
    if (!detectionResult.success) {
      console.error("Falha na detecção facial:", detectionResult.error);
      return {
        matches: [],
        noMatch: true,
        errorMessage: "Não foi possível detectar um rosto na imagem."
      };
    }
    
    // Buscar correspondências para o rosto detectado
    const matchResult = await sdk.matchFace(detectionResult.faceId || "");
    
    if (!matchResult.success) {
      console.error("Falha na busca por correspondências:", matchResult.error);
      return {
        matches: [],
        noMatch: true,
        errorMessage: "Erro ao processar busca de correspondência."
      };
    }
    
    // Se não encontrou correspondências
    if (matchResult.matches.length === 0) {
      return {
        matches: [],
        noMatch: true
      };
    }
    
    // Mapear resultados para o formato esperado
    const mappedMatches = matchResult.matches.map(match => ({
      name: match.name,
      profession: match.profession,
      avatar: match.avatar,
      schedule: match.schedule || []
    }));
    
    return {
      matches: mappedMatches,
      noMatch: false
    };
    
  } catch (error) {
    console.error("Erro no serviço de reconhecimento facial:", error);
    return {
      matches: [],
      noMatch: true,
      errorMessage: "Erro no processamento de reconhecimento facial."
    };
  }
};

// Interface for update_face_registration parameters
interface UpdateFaceRegistrationParams {
  user_id_param: string;
  is_registered: boolean;
}

// Interface for register_face parameters
interface RegisterFaceParams {
  user_id_param: string;
  face_id_param: string;
  confidence_param: number;
  status_param: string;
}

// Função para registrar rosto de um usuário
export const registerFaceForUser = async (imageData: string, userId: string): Promise<boolean> => {
  try {
    // Validar usuário
    const { data } = await supabase.auth.getUser();
    const authUserId = data?.user?.id;
    
    // Se não estiver autenticado ou IDs não corresponderem, falhar
    if (!authUserId) {
      console.error("Usuário não autenticado");
      return false;
    }
    
    if (authUserId !== userId && !userId.startsWith('temp_')) {
      console.error("ID de usuário inválido para registro facial");
      return false;
    }
    
    // Inicializar o SDK e registrar o rosto
    const sdk = await getFacialRecognitionSDK();
    const success = await sdk.registerFace(imageData, userId);
    
    // Se o registro foi bem-sucedido, atualizar o perfil do usuário usando RPC
    if (success && !userId.startsWith('temp_')) {
      // Fix: Use explicit typing for RPC function parameters
      const { error } = await supabase.rpc<null>('update_face_registration', {
        user_id_param: userId,
        is_registered: true
      } as UpdateFaceRegistrationParams);
      
      if (error) {
        console.error("Error updating profile after face registration:", error);
      }
    }
    
    return success;
  } catch (error) {
    console.error("Erro no serviço de registro facial:", error);
    return false;
  }
};
