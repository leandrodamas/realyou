
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";
import { detectAndMatchFace, registerFaceForUser } from "@/services/facialRecognitionService";
import { useFileUpload } from "./useFileUpload";

export const useFacialRecognition = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchAttemptRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);
  const { uploadFile } = useFileUpload();

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
      toast.info("Analisando imagem...");
      
      // Upload da imagem para armazenamento antes da análise
      const { data: { user } } = await supabase.auth.getUser();
      
      // Converter base64 para arquivo
      const imageBlob = await fetch(profileImage).then(r => r.blob());
      const imageFile = new File(
        [imageBlob], 
        `search-image-${Date.now()}.jpg`, 
        { type: 'image/jpeg' }
      );
      
      // Upload da imagem para bucket facial_recognition
      let imageUrl = profileImage;
      if (user) {
        const { publicUrl } = await uploadFile(imageFile, {
          bucketName: 'facial_recognition',
          folder: `searches/${user.id}`,
          metadata: {
            user_id: user?.id || 'anonymous',
            purpose: 'face_search'
          }
        });
        
        if (publicUrl) {
          imageUrl = publicUrl;
        }
      }
      
      // Simular um delay para análise (em produção seria uma API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isMounted.current || currentAttempt !== searchAttemptRef.current) {
        return;
      }
      
      // 70% chance de encontrar uma correspondência para demonstração
      const matchFound = Math.random() > 0.3;
      
      if (matchFound) {
        const person: MatchedPerson = {
          name: "Alex Johnson",
          profession: "Terapeuta",
          avatar: imageUrl, // Use a URL armazenada
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
        
        // Registrar resultado da pesquisa no histórico (comentado até a tabela estar disponível)
        /* 
        if (user) {
          await supabase
            .from('face_search_history')
            .insert({
              user_id: user.id,
              matched: true,
              matched_person_id: person.id,
              image_url: imageUrl,
              search_timestamp: new Date().toISOString()
            })
            .select();
        }
        */
        
        setMatchedPerson(person);
        toast.success("Correspondência encontrada com sucesso!");
      } else {
        setNoMatchFound(true);
        toast.info("Nenhuma correspondência encontrada");
        
        // Registrar pesquisa sem correspondência (comentado até a tabela estar disponível)
        /*
        if (user) {
          await supabase
            .from('face_search_history')
            .insert({
              user_id: user.id,
              matched: false,
              image_url: imageUrl,
              search_timestamp: new Date().toISOString()
            })
            .select();
        }
        */
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

  const registerFace = async (imageData: string, userId?: string) => {
    try {
      setIsSearching(true);
      
      // Obter ID do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      const effectiveUserId = userId || user?.id;
      
      if (!effectiveUserId) {
        toast.error("Necessário estar logado para registrar face");
        return false;
      }
      
      // Converter base64 para arquivo
      const imageBlob = await fetch(imageData).then(r => r.blob());
      const imageFile = new File(
        [imageBlob], 
        `face-registration-${Date.now()}.jpg`, 
        { type: 'image/jpeg' }
      );
      
      // Upload para bucket facial_recognition
      const { publicUrl } = await uploadFile(imageFile, {
        bucketName: 'facial_recognition',
        folder: `registrations/${effectiveUserId}`,
        metadata: {
          user_id: effectiveUserId,
          purpose: 'face_registration'
        }
      });
      
      if (!publicUrl) {
        throw new Error("Falha ao fazer upload da imagem");
      }
      
      // Registrar URL na tabela do usuário (simulação)
      toast.success("Face registrada com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao registrar face:", error);
      toast.error("Não foi possível registrar seu reconhecimento facial");
      return false;
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
    setIsSearching(false);
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
