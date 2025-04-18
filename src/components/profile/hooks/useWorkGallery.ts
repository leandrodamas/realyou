
import { useState, useEffect } from "react";
import { WorkItem } from "../types/gallery";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useWorkGallery = () => {
  const [items, setItems] = useState<WorkItem[]>([]);

  const loadWorkGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('work_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading work gallery:', error);
      toast.error("Erro ao carregar galeria");
    }
  };

  useEffect(() => {
    loadWorkGallery();
  }, []);

  return {
    items,
    reloadGallery: loadWorkGallery
  };
};
