
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";
import { useImageUploader } from "./useImageUploader";

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
      
      // Simular um delay para análise
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return { success: false, data: null };
      }
      
      // 70% chance de encontrar uma correspondência para demonstração
      const matchFound = Math.random() > 0.3;
      
      if (matchFound) {
        const person: MatchedPerson = {
          name: "Alex Johnson",
          profession: "Terapeuta",
          avatar: imageUrl,
          schedule: [
            { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
            { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
            { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
            { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
            { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
            { day: "Sábado", slots: ["10:00 - 14:00"], active: false },
            { day: "Domingo", slots: [], active: false }
          ]
        };
        
        // Note: A tabela face_search_history não está implementada no esquema do banco de dados ainda
        // Esta parte está comentada para evitar erros
        /*
        if (user) {
          await supabase
            .from('face_search_history')
            .insert({
              user_id: user.id,
              matched: true,
              matched_person_name: person.name,
              image_url: imageUrl,
              search_timestamp: new Date().toISOString()
            });
        }
        */
        
        toast.success("Correspondência encontrada com sucesso!");
        return { success: true, data: person };
      } else {
        // Note: A tabela face_search_history não está implementada no esquema do banco de dados ainda
        // Esta parte está comentada para evitar erros
        /*
        if (user) {
          await supabase
            .from('face_search_history')
            .insert({
              user_id: user.id,
              matched: false,
              image_url: imageUrl,
              search_timestamp: new Date().toISOString()
            });
        }
        */
        
        toast.info("Nenhuma correspondência encontrada");
        return { success: true, data: null, noMatch: true };
      }
    } catch (error) {
      console.error("Erro durante a busca por foto:", error);
      return { success: false, error };
    }
  };

  return { performSearch };
};
