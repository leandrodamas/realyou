
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Feed from "@/components/home/Feed";
import HomeHeader from "@/components/home/HomeHeader";
import FeatureCards from "@/components/home/FeatureCards";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import CameraButton from "@/components/home/CameraButton";
import Stories from "@/components/home/Stories";
import ForYouHeader from "@/components/home/ForYouHeader";

const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-b from-purple-50 via-white to-blue-50 min-h-screen pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ForYouHeader />
          <Feed />
        </motion.div>
      </div>

      <CameraButton />
    </motion.div>
  );
};

export default Index;
