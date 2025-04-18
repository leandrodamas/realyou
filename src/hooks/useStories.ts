
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
}

// Get Supabase URL and anon key from environment variables
// If they're not available, provide default error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client conditionally
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      // If Supabase client is not initialized, use fallback mock data
      if (!supabase) {
        console.warn('Supabase client not initialized. Using mock data.');
        // Provide some mock data for development
        const mockStories: Story[] = [
          {
            id: 1,
            username: "Você",
            profilePic: "/placeholder.svg",
            viewed: false
          },
          {
            id: 2,
            username: "maria",
            profilePic: "/placeholder.svg",
            viewed: false
          },
          {
            id: 3,
            username: "joão",
            profilePic: "/placeholder.svg",
            viewed: true
          }
        ];
        setStories(mockStories);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setStories(data || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
};
