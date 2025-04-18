
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Sparkles, Edit, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CameraButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const buttonVariants = {
    collapsed: { scale: 1 },
    expanded: { scale: 1.1 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 15
      } 
    })
  };

  const menuItems = [
    { icon: <Camera className="h-5 w-5 text-white" />, text: "Scan", path: "/face-recognition" },
    { icon: <Edit className="h-5 w-5 text-white" />, text: "Post", path: "/create-post" },
    { icon: <PlusCircle className="h-5 w-5 text-white" />, text: "Story", path: "/create-story" }
  ];

  return (
    <>
      <motion.div 
        className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={buttonVariants}
        initial="collapsed"
      >
        <motion.button 
          onClick={toggleExpand}
          className="rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 p-3.5 shadow-lg border-4 border-white"
          whileTap={{ scale: 0.9 }}
        >
          {isExpanded ? (
            <Sparkles className="h-8 w-8 text-white" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </motion.button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-2 w-48 border border-gray-100"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="py-2 space-y-1">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link to={item.path} onClick={() => setIsExpanded(false)}>
                      <motion.div 
                        className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center mr-3">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {isExpanded && (
        <motion.div 
          className="fixed inset-0 bg-black/20 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default CameraButton;
