
import React from "react";
import Stories from "@/components/home/Stories";
import Feed from "@/components/home/Feed";
import { Search, Bell, User, Camera, Calendar, Award, Map, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">RealYou</h1>
        <div className="flex space-x-3">
          <Link to="/search">
            <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </Link>
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <Link to="/profile">
            <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </Link>
        </div>
      </header>

      {/* Feature Cards */}
      <div className="mt-4 px-4 grid grid-cols-2 gap-3">
        <Link to="/advanced-search">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 h-full"
          >
            <div className="rounded-full bg-purple-100 w-10 h-10 flex items-center justify-center mb-2">
              <Map className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-base font-semibold mb-1">Busca 3D</h2>
            <p className="text-xs text-gray-600">Encontre profissionais próximos</p>
            <Badge className="mt-2 bg-purple-100 text-purple-700 border-0">Novo</Badge>
          </motion.div>
        </Link>
        
        <Link to="/timeline">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-4 h-full"
          >
            <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-base font-semibold mb-1">Agenda Visual</h2>
            <p className="text-xs text-gray-600">Gerencie seus horários</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">Dinâmico</Badge>
          </motion.div>
        </Link>
        
        <Link to="/onboarding">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-4 h-full"
          >
            <div className="rounded-full bg-amber-100 w-10 h-10 flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-base font-semibold mb-1">Perfil Completo</h2>
            <p className="text-xs text-gray-600">Ganhe pontos e mais visibilidade</p>
            <Badge className="mt-2 bg-amber-100 text-amber-700 border-0">Gamificado</Badge>
          </motion.div>
        </Link>
        
        <Link to="/search">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-4 h-full"
          >
            <div className="rounded-full bg-green-100 w-10 h-10 flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-base font-semibold mb-1">Match Pro</h2>
            <p className="text-xs text-gray-600">Descubra profissionais ideais</p>
            <Badge className="mt-2 bg-green-100 text-green-700 border-0">Inteligente</Badge>
          </motion.div>
        </Link>
      </div>

      {/* Welcome Banner with Registration Link */}
      <div className="mt-4 px-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">New to RealYou?</h2>
          <p className="text-gray-600 text-sm mb-3">Register your face to connect with friends in a whole new way</p>
          <Link to="/register">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
        <Stories />
      </div>

      {/* Feed */}
      <div className="mt-4">
        <Feed />
      </div>

      {/* Custom Camera Button (Center) */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
        <Link 
          to="/face-recognition" 
          className="rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 p-3 shadow-lg border-4 border-white">
          <Camera className="h-8 w-8 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default Index;
