
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Professional {
  id: string;
  name: string;
  username: string;
  avatar: string;
  title?: string;
  location?: string;
  rating?: number;
  skills?: string[];
}

export const useSearchProfessionals = (query: string = "") => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setIsLoading(true);

        // For now, we'll use demo data that would simulate search results
        // In a real app, you'd query Supabase with the search term
        const demoProfessionals: Professional[] = [
          { id: "1", name: "John Doe", username: "johndoe", avatar: "/placeholder.svg", title: "Web Developer" },
          { id: "2", name: "Maria Silva", username: "mariasilva", avatar: "/placeholder.svg", title: "UX Designer" },
          { id: "3", name: "Alex Johnson", username: "alexj", avatar: "/placeholder.svg", title: "Marketing Specialist" },
          { id: "4", name: "Sarah Parker", username: "sparker", avatar: "/placeholder.svg", title: "Business Consultant" },
        ];

        // Filter by query if provided
        const filteredResults = query
          ? demoProfessionals.filter(
              prof => 
                prof.name.toLowerCase().includes(query.toLowerCase()) ||
                prof.username.toLowerCase().includes(query.toLowerCase()) ||
                (prof.title && prof.title.toLowerCase().includes(query.toLowerCase()))
            )
          : demoProfessionals;

        setProfessionals(filteredResults);
      } catch (error) {
        console.error("Error searching professionals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfessionals();
  }, [query, user]);

  return { professionals, isLoading };
};
