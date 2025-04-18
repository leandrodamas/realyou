
import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from '@/integrations/supabase/types';

type Story = Database['public']['Tables']['stories']['Row'];

interface StoryCardProps {
  story: Story;
  isFirst?: boolean;
  onCreateStory?: () => void;
  onOpenStory: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, isFirst, onCreateStory, onOpenStory }) => {
  const handleClick = () => {
    if (isFirst && onCreateStory) {
      onCreateStory();
    } else {
      onOpenStory(story);
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <button 
        className="focus:outline-none"
        onClick={handleClick}
      >
        <div
          className={`${
            isFirst
              ? "p-0.5 bg-white border-2 border-dashed border-purple-400 rounded-xl"
              : story.viewed
              ? "p-0.5 border-2 border-gray-300 rounded-xl"
              : "p-0.5 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-xl"
          }`}
        >
          <div className="bg-white p-0.5 rounded-xl">
            <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={story.profilepic || "/placeholder.svg"}
                alt={story.username}
                className="object-cover w-full h-full"
              />
              {isFirst && (
                <div className="absolute bottom-2 right-2 bg-purple-500 rounded-full p-1 shadow-lg">
                  <Plus className="text-white h-3 w-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </button>
      <span className="text-xs mt-1.5 font-medium">{story.username}</span>
    </motion.div>
  );
};

export default StoryCard;
