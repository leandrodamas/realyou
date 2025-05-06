
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PostsTabProps {
  isOwner: boolean;
}

const PostsTab: React.FC<PostsTabProps> = ({ isOwner }) => {
  return (
    <TabsContent value="posts" className="p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Publicações</h3>
        {isOwner && (
          <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Nova publicação
          </Button>
        )}
      </div>
      <ProfileGallery isOwner={isOwner} />
    </TabsContent>
  );
};

export default PostsTab;
