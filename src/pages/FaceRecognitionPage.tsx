
import React, { useState } from "react";
import FaceCapture from "@/components/facial-recognition/FaceCapture";
import FaceTechnologyInfo from "@/components/facial-recognition/FaceTechnologyInfo";
import FaceSecurityPrivacy from "@/components/facial-recognition/FaceSecurityPrivacy";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FaceRecognitionPage: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex items-center border-b border-gray-100 shadow-sm">
        <Link to="/" className="mr-4 rounded-full hover:bg-gray-100 p-2 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Face Recognition</h1>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto flex items-center gap-1 text-gray-600"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-4 w-4" />
          {showInfo ? "Ocultar Info" : "Sobre"}
          {showInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </header>

      {/* Main Content */}
      <div className="container max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: showInfo ? "auto" : 0, opacity: showInfo ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-4"
        >
          <div className="space-y-4 mb-4">
            <FaceTechnologyInfo />
            <FaceSecurityPrivacy />
          </div>
        </motion.div>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="scan" className="data-[state=active]:bg-gradient-to-r from-purple-600 to-blue-500 data-[state=active]:text-white">
              Encontrar Pessoas
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-gradient-to-r from-purple-600 to-blue-500 data-[state=active]:text-white">
              Como Funciona
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="focus:outline-none">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
                <FaceCapture />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="focus:outline-none">
            <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
              <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Como usar o Reconhecimento Facial</h3>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-medium">1</span>
                  </div>
                  <p className="text-sm text-gray-600">Posicione seu rosto na frente da câmera e garanta boa iluminação</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-medium">2</span>
                  </div>
                  <p className="text-sm text-gray-600">Capture uma foto clara do seu rosto pressionando o botão da câmera</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-medium">3</span>
                  </div>
                  <p className="text-sm text-gray-600">O app buscará correspondências com outros usuários do RealYou</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-medium">4</span>
                  </div>
                  <p className="text-sm text-gray-600">Envie uma solicitação de conexão para estabelecer contato</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/register">
                    Ainda não tem registro? Cadastre-se agora
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FaceRecognitionPage;
