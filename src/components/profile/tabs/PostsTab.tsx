
import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define a type for posts
interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
}

interface PostsTabProps {
  isOwner: boolean;
  targetUserId: string;
}

const PostsTab: React.FC<PostsTabProps> = ({ isOwner, targetUserId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!targetUserId) return;
      setIsLoading(true);
      try {
        // Use the existing work_gallery table for posts
        const { data, error } = await supabase
          .from('work_gallery')
          .select('id, image_path, title, description')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        // Map work_gallery data to Post format
        const mappedPosts: Post[] = (data || []).map(item => ({
          id: item.id,
          imageUrl: item.image_path,
          caption: item.title || item.description
        }));
        
        setPosts(mappedPosts);
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
            onClick={handleNewPublication}
          >
            <Plus className="h-4 w-4" />
            Nova publicação
          </Button>
        )}
      </div>
      {/* ProfileGallery handles its own data loading */}
      <ProfileGallery isOwner={isOwner} />
    </TabsContent>
  );
};

export default PostsTab;
