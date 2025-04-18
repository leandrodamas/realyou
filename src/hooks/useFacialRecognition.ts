
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { detectAndMatchFace } from "@/services/facialRecognitionService";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

export const useFacialRecognition = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset error state when component unmounts
  useEffect(() => {
    return () => {
      setHasError(false);
    };
  }, []);

  const handleSearch = async (capturedImage: string) => {
    if (!capturedImage) {
      toast.error("Nenhuma imagem capturada para análise");
      return;
    }
    
    setIsSearching(true);
    setNoMatchFound(false);
    setHasError(false);
    
    try {
      const matchResult = await detectAndMatchFace(capturedImage);
      
      if (matchResult && matchResult.success) {
        if (matchResult.matches.length > 0) {
          const bestMatch = matchResult.matches[0];
          setMatchedPerson({
            name: bestMatch.name,
            profession: bestMatch.profession,
            avatar: bestMatch.avatar,
            schedule: bestMatch.schedule || []
          });
          toast.success("Reconhecimento facial concluído!");
        } else {
          setNoMatchFound(true);
          toast.info("Nenhuma correspondência encontrada");
        }
      } else {
        setHasError(true);
        toast.error("Falha no reconhecimento facial. Tente novamente.");
        setNoMatchFound(true);
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
      setHasError(true);
      toast.error("Ocorreu um erro durante o reconhecimento facial");
      setNoMatchFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const sendConnectionRequest = () => {
    setConnectionSent(true);
    toast.success("Solicitação de conexão enviada!");
  };

  const resetState = () => {
    setMatchedPerson(null);
    setNoMatchFound(false);
    setConnectionSent(false);
    setHasError(false);
  };

  return {
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    hasError,
    handleSearch,
    sendConnectionRequest,
    setNoMatchFound,
    setMatchedPerson,
    resetState
  };
};
