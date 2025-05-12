
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Map, Calendar, Award, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const FeatureCards: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  // Handler for protected routes
  const handleProtectedLink = (path: string, featureName: string) => {
    console.log(`${featureName} clicked, navigating to: ${path}`);
    
    if (!user) {
      toast.error("Você precisa estar logado para acessar esta funcionalidade");
      navigate("/auth");
      return;
    }
    
    try {
      navigate(path);
      toast.success(`Navegando para ${featureName}`);
    } catch (error) {
      console.error(`Navigation error for ${path}:`, error);
      toast.error(`Erro ao navegar para ${featureName}`);
    }
  };

  return (
    <motion.div 
      className="mt-6 px-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="mb-3 flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          Destaques <Sparkles className="h-4 w-4 text-amber-400 ml-1" />
        </h2>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600">
          Novidades
        </Badge>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          variants={item}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full cursor-pointer"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          onClick={() => {
            console.log("3D Search clicked");
            handleProtectedLink("/advanced-search", "Busca 3D");
          }}
        >
          <div className="h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="rounded-full bg-white p-3 shadow-md">
              <Map className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-base font-semibold mb-1">Busca 3D</h2>
            <p className="text-xs text-gray-600">Encontre profissionais próximos</p>
            <Badge className="mt-2 bg-purple-100 text-purple-700 border-0">Novo</Badge>
          </div>
        </motion.div>
        
        <motion.div 
          variants={item}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full cursor-pointer"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          onClick={() => {
            console.log("Timeline clicked");
            handleProtectedLink("/timeline", "Agenda Visual");
          }}
        >
          <div className="h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <div className="rounded-full bg-white p-3 shadow-md">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-base font-semibold mb-1">Agenda Visual</h2>
            <p className="text-xs text-gray-600">Gerencie seus horários</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">Dinâmico</Badge>
          </div>
        </motion.div>
        
        <motion.div 
          variants={item}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full cursor-pointer"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          onClick={() => {
            console.log("Onboarding clicked");
            handleProtectedLink("/onboarding", "Perfil Completo");
          }}
        >
          <div className="h-24 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
            <div className="rounded-full bg-white p-3 shadow-md">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-base font-semibold mb-1">Perfil Completo</h2>
            <p className="text-xs text-gray-600">Ganhe pontos e mais visibilidade</p>
            <Badge className="mt-2 bg-amber-100 text-amber-700 border-0">Gamificado</Badge>
          </div>
        </motion.div>
        
        <motion.div 
          variants={item}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full cursor-pointer"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          onClick={() => {
            console.log("Search clicked");
            handleProtectedLink("/search", "Match Pro");
          }}
        >
          <div className="h-24 bg-gradient-to-r from-green-500/20 to-teal-500/20 flex items-center justify-center">
            <div className="rounded-full bg-white p-3 shadow-md">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-base font-semibold mb-1">Match Pro</h2>
            <p className="text-xs text-gray-600">Descubra profissionais ideais</p>
            <Badge className="mt-2 bg-green-100 text-green-700 border-0">Inteligente</Badge>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureCards;
