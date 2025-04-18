
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Feed from "@/components/home/Feed";
import HomeHeader from "@/components/home/HomeHeader";
import FeatureCards from "@/components/home/FeatureCards";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import CameraButton from "@/components/home/CameraButton";
import Stories from "@/components/home/Stories";

const Index: React.FC = () => {
  // Efeito de rolagem suave quando o componente monta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-b from-purple-50 via-white to-blue-50 min-h-screen pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HomeHeader />
      
      <div className="max-w-md mx-auto">
        <Stories />
        <FeatureCards />
        <WelcomeBanner />
        
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="px-4 mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">For You</h2>
            <button className="text-sm font-medium text-purple-600">See All</button>
          </div>
          <Feed />
        </motion.div>
      </div>

      <CameraButton />
    </motion.div>
  );
};

export default Index;
