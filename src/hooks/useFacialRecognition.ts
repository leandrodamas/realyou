
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";
import { detectAndMatchFace } from "@/services/facialRecognitionService";

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
      toast.info("Analisando foto de perfil...");
      
      // Simulate profile photo analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify this is still the latest search attempt
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      // 70% chance to find a match for demonstration
      const matchFound = Math.random() > 0.3;
      
      if (matchFound) {
        const person: MatchedPerson = {
          name: "Alex Johnson",
          profession: "Terapeuta",
          avatar: profileImage, // Use the uploaded profile image
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
        
        setMatchedPerson(person);
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
