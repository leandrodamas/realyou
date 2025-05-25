
import React, { useState, useCallback } from "react";
import FaceCapture from "@/components/facial-recognition/FaceCapture";
import FaceTechnologyInfo from "@/components/facial-recognition/FaceTechnologyInfo";
import FaceSecurityPrivacy from "@/components/facial-recognition/FaceSecurityPrivacy";
import { ArrowLeft, ChevronDown, ChevronUp, Info, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import MatchedPersonCard from "@/components/facial-recognition/MatchedPersonCard";
import NoMatchFound from "@/components/facial-recognition/NoMatchFound";
import { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

const FaceRecognitionPage: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);

  const handleCaptureComplete = useCallback(async (imageData: string) => {
    console.log("FaceRecognitionPage: Capture complete, image data received.");
    setLastCapturedImage(imageData);
    setIsSearching(true);
    setMatchedPerson(null);
    setNoMatchFound(false);
    setConnectionSent(false);
    toast.info("Buscando correspondência...");

    try {
      const { data, error } = await supabase.functions.invoke("face-search", {
        body: { image_base64: imageData.split(',')[1] },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.match_found) {
        console.log("Match found:", data.user_profile);
        const profile = data.user_profile;
        setMatchedPerson({
          name: profile.full_name || "Usuário",
          profession: profile.profession || "Profissional",
          avatar: profile.avatar_url || "/placeholder.svg",
          connectionStatus: "not_connected",
        });
        toast.success("Usuário encontrado!");
      } else {
        console.log("No match found.");
        setNoMatchFound(true);
        toast.info("Nenhum usuário correspondente encontrado.");
      }
    } catch (err: any) {
      console.error("Erro na busca por reconhecimento facial:", err);
      toast.error(`Erro na busca: ${err.message}`);
      setNoMatchFound(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSendConnectionRequest = useCallback(async () => {
    if (!matchedPerson) return;

    toast.info("Enviando solicitação de conexão...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setConnectionSent(true);
      toast.success("Solicitação de conexão enviada!");
      setMatchedPerson(prev => prev ? { ...prev, connectionStatus: 'pending' } : null);

    } catch (err: any) {
      console.error("Erro ao enviar solicitação de conexão:", err);
      toast.error(`Erro ao conectar: ${err.message}`);
    }
  }, [matchedPerson]);

  const handleShowScheduleDialog = useCallback(() => {
    toast.info("Funcionalidade de agendamento em desenvolvimento");
  }, []);

  const handleResetSearch = () => {
    setMatchedPerson(null);
    setNoMatchFound(false);
    setConnectionSent(false);
    setLastCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex items-center border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <Link to="/" className="mr-4 rounded-full hover:bg-gray-100 p-2 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Busca por Foto</h1>
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
                {!matchedPerson && !noMatchFound && !isSearching && (
                  <FaceCapture onCaptureComplete={handleCaptureComplete} />
                )}

                {isSearching && (
                  <div className="flex flex-col items-center justify-center p-10 h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                    <p className="text-gray-600">Buscando correspondência...</p>
                  </div>
                )}

                {matchedPerson && !isSearching && (
                   <MatchedPersonCard
                      matchedPerson={matchedPerson}
                      connectionSent={connectionSent}
                      onSendConnectionRequest={handleSendConnectionRequest}
                      onShowScheduleDialog={handleShowScheduleDialog}
                    />
                )}

                {noMatchFound && !isSearching && (
                  <NoMatchFound onReset={handleResetSearch} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="focus:outline-none">
             <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
              <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Como usar a Busca por Foto</h3>
              <div className="space-y-3">
                 <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0"><span className="text-purple-600 font-medium">1</span></div>
                  <p className="text-sm text-gray-600">Posicione o rosto no centro da câmera em um ambiente bem iluminado</p>
                </div>
                 <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0"><span className="text-purple-600 font-medium">2</span></div>
                  <p className="text-sm text-gray-600">Aguarde a captura automática da melhor imagem</p>
                </div>
                 <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0"><span className="text-purple-600 font-medium">3</span></div>
                  <p className="text-sm text-gray-600">O app buscará correspondências com usuários do RealYou</p>
                </div>
                 <div className="flex gap-3">
                  <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0"><span className="text-purple-600 font-medium">4</span></div>
                  <p className="text-sm text-gray-600">Se encontrar, envie uma solicitação de conexão para estabelecer contato</p>
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
