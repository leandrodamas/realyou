
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";
import { useImageUploader } from "./useImageUploader";
import { getFacialRecognitionSDK } from "@/services/sdk/initializeSDK";

export const useSearchOperation = () => {
  const { uploadProfileImage } = useImageUploader();

  const performSearch = async (
    profileImage: string,
    isMounted: React.MutableRefObject<boolean>,
    currentAttempt: number,
    searchAttemptRef: React.MutableRefObject<number>
  ) => {
    try {
      toast.info("Analisando imagem...");
      
      // Upload da imagem para armazenamento antes da análise
      const { data: { user } } = await supabase.auth.getUser();
      
      let imageUrl = profileImage;
      if (user) {
        // Use the helper function to upload the image
        const publicUrl = await uploadProfileImage(
          profileImage, 
          user.id, 
          'face_search'
        );
        
        if (publicUrl) {
          imageUrl = publicUrl;
        }
      }
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return { success: false, data: null };
      }
      
      // Inicializar SDK de reconhecimento facial
      const facialSDK = await getFacialRecognitionSDK();
      
      // Detectar rosto na imagem
      const detectionResult = await facialSDK.detectFace(imageUrl);
      
      if (!detectionResult.success) {
        toast.error("Não foi possível detectar um rosto na imagem");
        return { success: false, data: null, noMatch: true };
      }
      
      // Buscar correspondências usando o SDK
      const matchResult = await facialSDK.matchFace(detectionResult.faceId || "");
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return { success: false, data: null };
      }
      
      // Define interface for log_face_search parameters
      interface LogFaceSearchParams {
        user_id_param: string;
        matched_param: boolean;
        matched_person_id_param: string | null;
        image_url_param: string;
      }
      
      // Registrar busca no histórico se o usuário estiver logado
      if (user) {
        try {
          // Fix: Use explicit types for RPC function parameters
          await supabase.rpc<null>('log_face_search', {
            user_id_param: user.id,
            matched_param: matchResult.matches.length > 0,
            matched_person_id_param: matchResult.matches[0]?.userId || null,
            image_url_param: imageUrl
          } as LogFaceSearchParams);
        } catch (error) {
          console.error("Erro ao registrar busca no histórico:", error);
          // Não impedimos o fluxo principal se o registro de histórico falhar
        }
      }
      
      if (matchResult.matches.length === 0) {
        toast.info("Nenhuma correspondência encontrada");
        return { success: true, data: null, noMatch: true };
      } else {
        // Mapear o resultado para o formato esperado
        const bestMatch = matchResult.matches[0];
        const person: MatchedPerson = {
          name: bestMatch.name,
          profession: bestMatch.profession,
          avatar: bestMatch.avatar || imageUrl,
          schedule: bestMatch.schedule || []
        };
        
        toast.success("Correspondência encontrada com sucesso!");
        return { success: true, data: person };
      }
    } catch (error) {
      console.error("Erro durante a busca por foto:", error);
      return { success: false, error };
    }
  };

  return { performSearch };
};
