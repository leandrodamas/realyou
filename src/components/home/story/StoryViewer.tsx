
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Database } from '@/integrations/supabase/types';

type Story = Database['public']['Tables']['stories']['Row'];

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup and cleanup effect
  useEffect(() => {
    // Auto-close the story after 5 seconds
    progressTimerRef.current = setTimeout(() => {
      onClose();
    }, 5000);
    
    // Cleanup function to ensure proper unmounting
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
    };
  }, [onClose]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 flex justify-center py-4 z-10">
        <div className="w-[95%] bg-gray-700 rounded-full h-1 overflow-hidden">
          <motion.div 
            className="bg-white h-full" 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5 }}
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="p-2 bg-gray-800/50 backdrop-blur-sm rounded-full"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden bg-gray-800 relative"
        >
          <img 
            src={story.profilepic || "/placeholder.svg"}
            alt="Story" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 border-2 border-white mr-2">
                <img src={story.profilepic || "/placeholder.svg"} alt={story.username} />
              </Avatar>
              <span className="text-white font-medium">{story.username}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StoryViewer;
