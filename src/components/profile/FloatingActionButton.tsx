
import React, { useState } from "react";
import { Plus, Camera, Calendar, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionButtonProps {
  onNewPost?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onNewPost }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (action: string) => {
    setIsOpen(false);
    if (action === "post" && onNewPost) {
      onNewPost();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="flex flex-col items-end gap-3 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ staggerChildren: 0.1, staggerDirection: -1 }}
            >
              <motion.button
                className="flex items-center gap-2 bg-white shadow-lg rounded-full pl-4 pr-3 py-2 border border-gray-200"
                onClick={() => handleButtonClick("post")}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">Adicionar publicação</span>
                <span className="bg-purple-500 p-2 rounded-full">
                  <Image size={16} className="text-white" />
                </span>
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 bg-white shadow-lg rounded-full pl-4 pr-3 py-2 border border-gray-200"
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">Criar story</span>
                <span className="bg-blue-500 p-2 rounded-full">
                  <Camera size={16} className="text-white" />
                </span>
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 bg-white shadow-lg rounded-full pl-4 pr-3 py-2 border border-gray-200"
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">Adicionar horário</span>
                <span className="bg-green-500 p-2 rounded-full">
                  <Calendar size={16} className="text-white" />
                </span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <motion.button
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
          isOpen ? "bg-gray-700" : "bg-gradient-to-r from-purple-600 to-blue-500"
        }`}
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
