
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchState } from "./useSearchState";
import { useSearchOperation } from "./useSearchOperation";
import { useFaceRegistration } from "./useFaceRegistration";
import type { UseFacialRecognitionResult } from "./types";

export const useFacialRecognition = (): UseFacialRecognitionResult => {
  const {
    isSearching,
    setIsSearching,
    matchedPerson,
    setMatchedPerson,
    noMatchFound,
    setNoMatchFound,
    connectionSent,
    setConnectionSent,
    hasError,
    setHasError,
    searchAttemptRef,
    isMounted,
    resetState
  } = useSearchState();

  const { performSearch } = useSearchOperation();
  const { registerFace: registerFaceImpl } = useFaceRegistration();

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
      const result = await performSearch(
        profileImage, 
        isMounted, 
        currentAttempt, 
        searchAttemptRef
      );
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      if (!result.success) {
        setHasError(true);
        toast.error("Ocorreu um erro durante a busca por correspondência");
        setNoMatchFound(true);
      } else if (result.noMatch) {
        setNoMatchFound(true);
      } else if (result.data) {
        setMatchedPerson(result.data);
      }
    } catch (error) {
      console.error("Error during search:", error);
      
      if (isMounted.current && currentAttempt === searchAttemptRef.current) {
        setHasError(true);
        toast.error("Ocorreu um erro durante a busca por correspondência");
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

  // Export the wrapped registerFace function
  const registerFace = async (imageData: string, userId?: string) => {
    setIsSearching(true);
    const result = await registerFaceImpl(imageData, userId);
    setIsSearching(false);
    return result;
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

// Re-export types for convenience
export * from './types';
export * from './useProfileStorage';
