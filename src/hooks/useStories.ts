
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
}

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setStories(data || []);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching stories:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
};
