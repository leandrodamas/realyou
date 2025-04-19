
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

// Simulação da busca por correspondências usando fotos
// Em um ambiente real, isto seria substituído por chamadas para uma API de comparação de fotos
const mockPhotoSearch = async (photoData: string): Promise<MatchedPerson | null> => {
  // Simular processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 70% de chance de encontrar uma correspondência para demonstração
  const matchFound = Math.random() > 0.3;
  
  if (matchFound) {
    return {
      name: "Alex Johnson",
      profession: "Terapeuta",
      avatar: photoData, // Usar a foto capturada
      schedule: [
        { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
        { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
        { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
        { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
        { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
        { day: "Sábado", slots: ["10:00 - 14:00"], active: false },
        { day: "Domingo", slots: [], active: false }
      ]
    };
  }
  
  return null;
};

export const useFacialRecognition = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchAttemptRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);

  // Reset error state when component unmounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
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
    
    const currentAttempt = ++searchAttemptRef.current;
    
    try {
      toast.info("Analisando foto...");
      
      // Simulação da busca por correspondência baseada em foto
      const match = await mockPhotoSearch(capturedImage);
      
      // Verificar se esta é ainda a última tentativa de pesquisa
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      if (match) {
        setMatchedPerson(match);
        toast.success("Correspondência encontrada com sucesso!");
      } else {
        setNoMatchFound(true);
        toast.info("Nenhuma correspondência encontrada");
      }
    } catch (error) {
      console.error("Erro durante a busca por foto:", error);
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      setHasError(true);
      toast.error("Ocorreu um erro durante a busca por correspondência");
      setNoMatchFound(true);
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

  const resetState = () => {
    setMatchedPerson(null);
    setNoMatchFound(false);
    setConnectionSent(false);
    setHasError(false);
    setIsSearching(false);
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
