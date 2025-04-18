
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { detectAndMatchFace } from "@/services/facialRecognitionService";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

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
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      // Em dispositivos móveis, mostrar um toast de status intermediário
      if (isMobile) {
        toast.info("Analisando imagem...", {
          duration: 2000
        });
      }
      
      // Tempo variável de espera para dispositivos móveis vs desktop
      const timeoutDuration = isMobile ? 2500 : 1500;
      
      // Usar um timeout para garantir que o toast seja exibido
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const matchResult = await detectAndMatchFace(capturedImage);
      
      // Verificar se esta é ainda a última tentativa de pesquisa
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      if (matchResult && matchResult.success) {
        if (matchResult.matches.length > 0) {
          const bestMatch = matchResult.matches[0];
          setMatchedPerson({
            name: bestMatch.name,
            profession: bestMatch.profession,
            avatar: bestMatch.avatar,
            schedule: bestMatch.schedule || []
          });
          
          // Pequeno atraso antes de mostrar o toast de sucesso para melhor UX
          setTimeout(() => {
            if (isMounted.current) {
              toast.success("Reconhecimento facial concluído!");
            }
          }, 300);
        } else {
          setNoMatchFound(true);
          toast.info("Nenhuma correspondência encontrada");
        }
      } else {
        setHasError(true);
        toast.error(isMobile ? 
          "Falha no reconhecimento. Tente com melhor iluminação." : 
          "Falha no reconhecimento facial. Tente novamente."
        );
        setNoMatchFound(true);
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      setHasError(true);
      toast.error("Ocorreu um erro durante o reconhecimento facial");
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
