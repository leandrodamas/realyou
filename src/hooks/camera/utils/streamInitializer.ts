
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
    const timeoutDuration = isMobile ? 10000 : 8000; // Tempo maior para dispositivos móveis
    
    const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
    
    // Adicionar um timeout para evitar travamento indefinido
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
    
    console.log("Stream da câmera obtido com sucesso");
    return stream;
  } catch (error: any) {
    console.error("Erro ao obter mídia do usuário:", error);
    
    // Fornecer mensagem de erro mais descritiva com base no tipo de erro
    let errorMessage = error.message || "Erro desconhecido";
    let errorName = error.name || "UnknownError";
    
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      errorMessage = "Câmera já está em uso por outro aplicativo. Feche outros aplicativos que possam estar usando a câmera.";
    } else if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorMessage = "Permissão de câmera negada. Por favor, conceda permissão de câmera nas configurações do seu navegador.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "Nenhuma câmera encontrada neste dispositivo.";
    } else if (error.message && error.message.includes("timeout")) {
      errorMessage = "Tempo de acesso à câmera esgotado. Por favor, tente novamente.";
    } else if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Erros específicos para dispositivos móveis
      errorMessage = "Falha ao acessar a câmera do dispositivo móvel. Verifique as permissões do aplicativo.";
    }
    
    // Relançar com mensagem mais descritiva
    const enhancedError = new Error(errorMessage);
    enhancedError.name = errorName;
    throw enhancedError;
  }
};
