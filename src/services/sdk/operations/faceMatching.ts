
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
    // Fetch real registered faces from face_registrations table
    const { data: registrations, error: regError } = await supabase
      .from('face_registrations')
      .select('user_id, confidence')
      .eq('face_id', faceId)
      .eq('status', 'active');
    
    if (regError) {
      console.error("Error fetching face registrations:", regError);
      return { success: false, matches: [], error: "Erro ao buscar registros faciais" };
    }
    
    if (!registrations || registrations.length === 0) {
      // No real face matches found
      return { success: true, matches: [] };
    }
    
    // Get profile information for the matched users
    const userIds = registrations.map(reg => reg.user_id);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, profession, avatar_url')
      .in('id', userIds);
    
    if (profileError || !profiles || profiles.length === 0) {
      console.error("Error fetching profiles:", profileError);
      return { success: true, matches: [] };
    }
    
    // Map the profile data to the expected format
    const matches = profiles.map(profile => {
      // Find the corresponding registration to get confidence
      const registration = registrations.find(reg => reg.user_id === profile.id);
      
      return {
        userId: profile.id || '',
        name: profile.full_name || "Usuário",
        profession: profile.profession || "Profissional",
        avatar: profile.avatar_url || "",
        confidence: registration?.confidence || 0.75,
        schedule: [
          { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
          { day: "Sábado", slots: [], active: false },
          { day: "Domingo", slots: [], active: false }
        ]
      };
    });
    
    return {
      success: true,
      matches: matches
    };
  } catch (error) {
    console.error("Erro na correspondência facial:", error);
    return { success: false, matches: [], error: "Erro no processamento da correspondência" };
  }
}
