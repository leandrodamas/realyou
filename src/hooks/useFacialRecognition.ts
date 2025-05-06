
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { detectAndMatchFace, registerFaceForUser } from "@/services/facialRecognitionService";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

export const useFacialRecognition = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchAttemptRef = useRef(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      setHasError(false);
    };
  }, []);

  const resetState = () => {
    setMatchedPerson(null);
    setNoMatchFound(false);
    setConnectionSent(false);
    setIsSearching(false);
    setHasError(false);
    searchAttemptRef.current = 0;
  };

  const handleSearch = async (profileImage: string) => {
    if (!profileImage) {
      toast.error("Nenhuma imagem para análise");
      return;
    }
    
    setIsSearching(true);
    setNoMatchFound(false);
    setHasError(false);
    
    const currentAttempt = ++searchAttemptRef.current;
    
    try {
      console.log("Iniciando busca facial com imagem");
      toast.info("Analisando foto...");
      
      // Usar o serviço de reconhecimento facial para detectar e buscar correspondências
      const matchResult = await detectAndMatchFace(profileImage);
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      if (!matchResult || matchResult.matches.length === 0) {
        toast.info("Nenhuma correspondência encontrada");
        setNoMatchFound(true);
      } else {
        // Pegar a melhor correspondência
        const bestMatch = matchResult.matches[0];
        
        // Construir o objeto de pessoa correspondente
        const person: MatchedPerson = {
          name: bestMatch.name,
          profession: bestMatch.profession,
          avatar: bestMatch.avatar || profileImage,
          schedule: bestMatch.schedule || []
        };
        
        setMatchedPerson(person);
        toast.success("Correspondência encontrada!");
      }
    } catch (error) {
      console.error("Erro durante a busca facial:", error);
      
      if (isMounted.current && currentAttempt === searchAttemptRef.current) {
        setHasError(true);
        toast.error("Erro ao processar reconhecimento facial");
        setNoMatchFound(true);
      }
    } finally {
      if (isMounted.current && currentAttempt === searchAttemptRef.current) {
        setIsSearching(false);
      }
    }
  };

  const sendConnectionRequest = () => {
    setConnectionSent(true);
    toast.success("Solicitação de conexão enviada!");
  };

  const registerFace = async (imageData: string, userId?: string) => {
    setIsSearching(true);
    try {
      if (!userId) {
        const tempId = `temp_${Date.now()}`;
        userId = tempId;
      }
      
      const success = await registerFaceForUser(imageData, userId);
      
      if (success) {
        toast.success("Rosto registrado com sucesso!");
      } else {
        toast.error("Não foi possível registrar seu rosto");
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao registrar rosto:", error);
      toast.error("Erro durante o registro facial");
      return false;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    hasError,
    handleSearch,
    registerFace,
    sendConnectionRequest,
    setNoMatchFound,
    setMatchedPerson,
    resetState
  };
};

export type { MatchedPerson };
