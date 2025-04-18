
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStories } from "@/hooks/useStories";
import { toast } from "sonner";
import StoryCard from "./story/StoryCard";
import StoryViewer from "./story/StoryViewer";
import CreateStorySheet from "./story/CreateStorySheet";
import type { Database } from '@/integrations/supabase/types';

type Story = Database['public']['Tables']['stories']['Row'];

const Stories: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { stories, loading, error } = useStories();
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [storyCaption, setStoryCaption] = useState("");

  const handleCreateStory = () => {
    setIsAddingStory(true);
  };

  const handleSubmitStory = () => {
    toast.success("História criada com sucesso!");
    setIsAddingStory(false);
    setStoryCaption("");
  };

  if (loading) return <div>Carregando histórias...</div>;
  if (error) return <div>Erro ao carregar histórias: {error}</div>;

  return (
    <>
      <motion.div 
        className="py-4" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
      >
        <div className="pl-4 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Histórias</h2>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar pb-2 pl-4 space-x-4">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              isFirst={story.id === 1}
              onCreateStory={handleCreateStory}
              onOpenStory={setSelectedStory}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedStory && (
          <StoryViewer 
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>

      <CreateStorySheet
        isOpen={isAddingStory}
        onOpenChange={setIsAddingStory}
        onSubmit={handleSubmitStory}
        storyCaption={storyCaption}
        onCaptionChange={setStoryCaption}
      />
    </>
  );
};

export default Stories;
