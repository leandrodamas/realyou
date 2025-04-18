
import { supabase } from "@/integrations/supabase/client";

export const seedStories = async () => {
  const initialStories = [
    {
      username: "Você",
      profilePic: "/placeholder.svg",
      viewed: false
    },
    {
      username: "maria",
      profilePic: "/placeholder.svg",
      viewed: false
    },
    {
      username: "joão",
      profilePic: "/placeholder.svg",
      viewed: true
    }
  ];

  for (const story of initialStories) {
    const { error } = await supabase
      .from('stories')
      .insert(story);
    
    if (error) {
      console.error('Error seeding story:', error);
    }
  }
};
