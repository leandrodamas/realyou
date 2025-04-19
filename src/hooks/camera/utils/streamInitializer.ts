
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Inicializando câmera com configurações:", JSON.stringify(constraints));
  
  try {
    // Primeiro, limpar qualquer stream anterior
    if (videoRef.current && videoRef.current.srcObject) {
      const oldStream = videoRef.current.srcObject as MediaStream;
      cleanupCameraStream(oldStream, videoRef.current);
    }

    // Tentar acessar a câmera com um timeout mais curto para dispositivos móveis
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const timeoutDuration = isMobile ? 15000 : 10000; // Tempo maior para dispositivos móveis
    
    // Tentar múltiplas vezes para aumentar as chances de sucesso
    let attemptCount = 0;
    const maxAttempts = 3;
    let lastError = null;
    
    while (attemptCount < maxAttempts) {
      try {
        // Adicionar um pequeno atraso entre tentativas
        if (attemptCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`Tentativa ${attemptCount + 1} de inicializar câmera...`);
        }
        
        // Modificar ligeiramente as constraints para cada tentativa
        let currentConstraints = { ...constraints };
        if (attemptCount === 1) {
          // Segunda tentativa: sem especificar facingMode
          if (isMobile && currentConstraints.video && typeof currentConstraints.video === 'object') {
            const videoConstraints = { ...currentConstraints.video };
            delete videoConstraints.facingMode;
            currentConstraints.video = videoConstraints;
          }
        } else if (attemptCount === 2) {
          // Terceira tentativa: configuração mínima
          currentConstraints = { 
            audio: false, 
            video: isMobile ? true : { width: 320, height: 240 } 
          };
        }
        
        console.log(`Tentativa ${attemptCount + 1} com configurações:`, JSON.stringify(currentConstraints));
        
        // Usar Promise.race para evitar espera infinita
        const streamPromise = navigator.mediaDevices.getUserMedia(currentConstraints);
        
        const timeoutPromise = new Promise<MediaStream>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout de acesso à câmera")), timeoutDuration);
        });
        
        // Corrida entre o acesso real à câmera e o timeout
        const stream = await Promise.race([streamPromise, timeoutPromise]);
        
        // Se o componente foi desmontado durante o processo, limpar o stream
        if (!mountedRef.current) {
          console.log("Componente desmontado, limpando stream");
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        
        // Para dispositivos iOS, tentar forçar resolução mais baixa
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isIOS) {
          const tracks = stream.getVideoTracks();
          if (tracks.length > 0) {
            try {
              await tracks[0].applyConstraints({
                width: { ideal: 640 },
                height: { ideal: 480 }
              });
            } catch (e) {
              console.warn("Não foi possível aplicar restrições de resolução mais baixa:", e);
            }
          }
        }
        
        console.log("Stream da câmera obtido com sucesso na tentativa", attemptCount + 1);
        return stream;
      } catch (error) {
        lastError = error;
        attemptCount++;
        
        if (attemptCount >= maxAttempts) {
          console.error(`Falha após ${maxAttempts} tentativas de acessar a câmera:`, error);
          break;
        }
      }
    }
    
    // Se chegamos aqui, todas as tentativas falharam
    console.error("Todas as tentativas de acesso à câmera falharam:", lastError);
    
    // Fornecer mensagem de erro mais descritiva com base no tipo de erro
    let errorMessage = lastError?.message || "Erro desconhecido";
    let errorName = lastError?.name || "UnknownError";
    
    if (errorName === "NotReadableError" || errorName === "TrackStartError") {
      errorMessage = "Câmera já está em uso por outro aplicativo. Feche outros aplicativos que possam estar usando a câmera.";
    } else if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
      errorMessage = "Permissão de câmera negada. Por favor, conceda permissão de câmera nas configurações do seu navegador.";
    } else if (errorName === "NotFoundError") {
      errorMessage = "Nenhuma câmera encontrada neste dispositivo.";
    } else if (errorMessage && errorMessage.includes("timeout")) {
      errorMessage = "Tempo de acesso à câmera esgotado. Por favor, tente novamente.";
    } else if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Erros específicos para dispositivos móveis
      errorMessage = "Falha ao acessar a câmera do dispositivo móvel. Verifique as permissões do aplicativo.";
    }
    
    // Relançar com mensagem mais descritiva
    const enhancedError = new Error(errorMessage);
    enhancedError.name = errorName;
    throw enhancedError;
  } catch (error: any) {
    console.error("Erro ao obter mídia do usuário:", error);
    
    // Relançar o erro com mais informações
    throw error;
  }
};
