
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Feed from "@/components/home/Feed";
import HomeHeader from "@/components/home/HomeHeader";
import FeatureCards from "@/components/home/FeatureCards";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import CameraButton from "@/components/home/CameraButton";
import Stories from "@/components/home/Stories";
import ForYouHeader from "@/components/home/ForYouHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
        
        {!user && (
          <motion.div 
            className="mt-4 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-sm p-5 border border-purple-200 overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-xl" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-xl" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-semibold mb-2">Bem-vindo ao RealYou!</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Faça login ou crie uma conta para desbloquear todos os recursos e obter uma experiência personalizada.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
                  onClick={() => navigate("/auth")}
                >
                  Entrar ou Criar Conta <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {user && <WelcomeBanner />}
        
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

      {user && <CameraButton />}
    </motion.div>
  );
};

export default Index;
