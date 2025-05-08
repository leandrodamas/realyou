
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
    // Buscar rostos registrados da tabela face_registrations
    const { data: registrations, error: regError } = await supabase
      .from('face_registrations')
      .select('user_id, confidence')
      .eq('face_id', faceId)
      .eq('status', 'active');
    
    if (regError) {
      console.error("Erro ao buscar registros faciais:", regError);
      return { success: false, matches: [], error: "Erro ao buscar registros faciais" };
    }
    
    if (!registrations || registrations.length === 0) {
      // Nenhuma correspondência facial encontrada
      console.log("Nenhuma correspondência facial encontrada");
      return { success: true, matches: [] };
    }
    
    // Obter informações de perfil para os usuários correspondentes
    const userIds = registrations.map(reg => reg.user_id);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, profession, avatar_url')
      .in('id', userIds);
    
    if (profileError || !profiles || profiles.length === 0) {
      console.error("Erro ao buscar perfis:", profileError);
      return { success: true, matches: [] };
    }
    
    // Obter informações de disponibilidade para usuários correspondentes
    const { data: schedules, error: scheduleError } = await supabase
      .from('service_schedules')
      .select('user_id, day_of_week, start_time, end_time, is_available')
      .in('user_id', userIds);
    
    if (scheduleError) {
      console.error("Erro ao buscar agendas:", scheduleError);
      // Continuamos mesmo se não conseguirmos obter os horários
    }
    
    // Transformar os horários em dias da semana
    const scheduleByUser: Record<string, any[]> = {};
    
    // Inicializar com estrutura padrão para todos os usuários
    userIds.forEach(userId => {
      scheduleByUser[userId] = [
        { day: "Segunda", slots: [], active: false },
        { day: "Terça", slots: [], active: false },
        { day: "Quarta", slots: [], active: false },
        { day: "Quinta", slots: [], active: false },
        { day: "Sexta", slots: [], active: false },
        { day: "Sábado", slots: [], active: false },
        { day: "Domingo", slots: [], active: false }
      ];
    });
    
    // Preencher com dados reais se disponíveis
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    
    schedules?.forEach(schedule => {
      const userId = schedule.user_id;
      const dayIndex = schedule.day_of_week % 7; // Garantir que está entre 0-6
      const dayName = dayNames[dayIndex];
      const timeSlot = `${schedule.start_time} - ${schedule.end_time}`;
      
      const daySchedule = scheduleByUser[userId]?.find(day => day.day === dayName);
      if (daySchedule) {
        daySchedule.active = schedule.is_available;
        if (schedule.is_available) {
          daySchedule.slots.push(timeSlot);
        }
      }
    });
    
    // Mapear os dados do perfil para o formato esperado
    const matches = profiles.map(profile => {
      // Encontrar o registro correspondente para obter confiança
      const registration = registrations.find(reg => reg.user_id === profile.id);
      
      return {
        userId: profile.id || '',
        name: profile.full_name || "Usuário",
        profession: profile.profession || "Profissional",
        avatar: profile.avatar_url || "",
        confidence: registration?.confidence || 0.75,
        schedule: scheduleByUser[profile.id] || [
          { day: "Segunda", slots: ["09:00 - 12:00"], active: true },
          { day: "Terça", slots: ["09:00 - 12:00"], active: true },
          { day: "Quarta", slots: ["09:00 - 12:00"], active: true },
          { day: "Quinta", slots: ["09:00 - 12:00"], active: true },
          { day: "Sexta", slots: ["09:00 - 12:00"], active: true },
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
