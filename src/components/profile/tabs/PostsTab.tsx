import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // Assuming Supabase client is here
import { toast } from "sonner";

// Define a type for posts if not already defined
interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  // Add other relevant post fields
}

interface PostsTabProps {
  isOwner: boolean;
  targetUserId: string; // Add targetUserId prop
}

const PostsTab: React.FC<PostsTabProps> = ({ isOwner, targetUserId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!targetUserId) return;
      setIsLoading(true);
      try {
        // TODO: Replace 'posts_table' with your actual table name and adjust columns
        const { data, error } = await supabase
          .from('posts_table') // Replace with your actual posts table name
          .select('id, imageUrl: image_url, caption') // Adjust column names as needed
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Erro ao carregar publicações.");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [targetUserId]);

  const handleNewPublication = () => {
      // Logic to open a modal or navigate to a new post creation page
      toast.info("Funcionalidade de nova publicação em desenvolvimento");
  };

  return (
    <TabsContent value="posts" className="p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Publicações</h3>
        {isOwner && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full flex items-center gap-1"
            onClick={handleNewPublication} // Add onClick handler
          >
            <Plus className="h-4 w-4" />
            Nova publicação
          </Button>
        )}
      </div>
      {/* Pass fetched posts to ProfileGallery */}
      <ProfileGallery 
        isOwner={isOwner} 
        posts={posts} // Pass posts data
        isLoading={isLoading} // Pass loading state
      />
    </TabsContent>
  );
};

export default PostsTab;

