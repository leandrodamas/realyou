
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";
import FaceRecognitionHeader from "@/components/facial-recognition/FaceRecognitionHeader";
import FaceInfoSection from "@/components/facial-recognition/FaceInfoSection";
import FaceSearchContent from "@/components/facial-recognition/FaceSearchContent";
import FaceInstructionsTab from "@/components/facial-recognition/FaceInstructionsTab";

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
          title: profile.profession || "Profissional",
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
      <FaceRecognitionHeader 
        showInfo={showInfo}
        onToggleInfo={() => setShowInfo(!showInfo)}
      />

      <div className="container max-w-md mx-auto px-4 py-6">
        <FaceInfoSection showInfo={showInfo} />

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
            <FaceSearchContent
              isSearching={isSearching}
              matchedPerson={matchedPerson}
              noMatchFound={noMatchFound}
              connectionSent={connectionSent}
              onCaptureComplete={handleCaptureComplete}
              onSendConnectionRequest={handleSendConnectionRequest}
              onShowScheduleDialog={handleShowScheduleDialog}
              onReset={handleResetSearch}
            />
          </TabsContent>

          <TabsContent value="info" className="focus:outline-none">
            <FaceInstructionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FaceRecognitionPage;
