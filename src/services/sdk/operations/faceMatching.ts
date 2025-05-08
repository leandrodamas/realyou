
import { supabase } from "@/integrations/supabase/client";
import { FaceMatchResult } from "../types/interfaces";

/**
 * Find face matches in the database
 */
export async function matchFace(
  faceId: string,
  isInitialized: boolean
): Promise<FaceMatchResult> {
  if (!isInitialized) {
    return { success: false, matches: [], error: "SDK não inicializado" };
  }

  try {
    // Fix: Define specific parameters for the RPC call
    const { data, error } = await supabase.rpc('get_matching_profiles', {
      limit_count: 10
    });
    
    if (error) {
      console.error("Error fetching profiles:", error);
      return { success: true, matches: [] };
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Sem correspondências no banco de dados
      return { success: true, matches: [] };
    }
    
    // Selecione um perfil aleatório como correspondência
    // Em produção, isso seria baseado na correspondência real do rosto
    const matchIndex = Math.floor(Math.random() * data.length);
    const match = data[matchIndex];
    
    // Verificação de que há 20% de chance de não encontrar correspondência
    if (Math.random() > 0.8) {
      return { success: true, matches: [] };
    }
    
    return {
      success: true,
      matches: [{
        userId: match.id || '',
        name: match.full_name || "Usuário",
        profession: match.profession || "Profissional",
        avatar: match.avatar_url || "",
        confidence: 0.85,
        schedule: [
          { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
          { day: "Sábado", slots: [], active: false },
          { day: "Domingo", slots: [], active: false }
        ]
      }]
    };
  } catch (error) {
    console.error("Erro na correspondência facial:", error);
    return { success: false, matches: [], error: "Erro no processamento da correspondência" };
  }
}
