
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";

const WelcomeBanner: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const { getProfile } = useProfileStorage();
  
  useEffect(() => {
    // Check if user has a profile
    const profile = getProfile();
    if (profile && profile.fullName) {
      setIsRegistered(true);
    }
  }, [getProfile]);
  
  // Don't show welcome banner for registered users
  if (isRegistered) {
    return null;
  }

  return (
    <motion.div 
      className="mt-4 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-sm p-5 border border-purple-100 overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-xl" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold">New to RealYou?</h2>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-[85%]">
            Register your face to connect with friends in a whole new way and unlock 
            all the exclusive features
          </p>
          
          <Link to="/register">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 rounded-xl h-12 shadow-md">
              <span>Get Started</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          
          <div className="mt-3 flex justify-center">
            <motion.div 
              className="flex space-x-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-purple-300 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 1.5,
                    delay: i * 0.3 
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
