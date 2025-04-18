
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
}

const Stories: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  const stories: Story[] = [
    { id: 1, username: "You", profilePic: "/placeholder.svg", viewed: false },
    { id: 2, username: "John", profilePic: "/placeholder.svg", viewed: false },
    { id: 3, username: "Maria", profilePic: "/placeholder.svg", viewed: true },
    { id: 4, username: "Alex", profilePic: "/placeholder.svg", viewed: false },
    { id: 5, username: "Sarah", profilePic: "/placeholder.svg", viewed: true },
    { id: 6, username: "Robert", profilePic: "/placeholder.svg", viewed: false },
  ];

  const openStory = (story: Story) => {
    setSelectedStory(story);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  return (
    <>
      <motion.div 
        className="py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="pl-4 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Stories</h2>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar pb-2 pl-4 space-x-4">
          {stories.map((story) => (
            <motion.div 
              key={story.id} 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                className="focus:outline-none"
                onClick={() => story.id !== 1 && openStory(story)}
              >
                <div
                  className={`${
                    story.id === 1
                      ? "p-0.5 bg-white border-2 border-dashed border-purple-400 rounded-xl"
                      : story.viewed
                      ? "p-0.5 border-2 border-gray-300 rounded-xl"
                      : "p-0.5 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-xl"
                  }`}
                >
                  <div className="bg-white p-0.5 rounded-xl">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={story.profilePic}
                        alt={story.username}
                        className="object-cover w-full h-full"
                      />
                      {story.id === 1 && (
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
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedStory && (
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
                  onAnimationComplete={closeStory}
                />
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={closeStory}
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
                  src={selectedStory.profilePic} 
                  alt="Story" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center">
                    <Avatar className="w-8 h-8 border-2 border-white mr-2">
                      <img src={selectedStory.profilePic} alt={selectedStory.username} />
                    </Avatar>
                    <span className="text-white font-medium">{selectedStory.username}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Stories;
