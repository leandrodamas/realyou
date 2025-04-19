
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Initializing camera with constraints:", JSON.stringify(constraints));
  
  try {
    // Primeiro, limpe qualquer stream anterior
    if (videoRef.current && videoRef.current.srcObject) {
      const oldStream = videoRef.current.srcObject as MediaStream;
      oldStream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    // Solicitar a stream com um timeout
    const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
    
    // Criar um timeout para garantir que não ficaremos presos esperando
    const timeoutPromise = new Promise<MediaStream>((_, reject) => {
      setTimeout(() => reject(new Error("Camera access timeout")), 15000);
    });
    
    // Usar Promise.race para evitar ficar preso se a permissão não for concedida
    const stream = await Promise.race([streamPromise, timeoutPromise]);
    console.log("Camera stream obtained successfully");
    
    if (!mountedRef.current) {
      console.log("Component unmounted, cleaning up stream");
      stream.getTracks().forEach(track => track.stop());
      return null;
    }
    
    if (videoRef.current && mountedRef.current) {
      const video = videoRef.current;
      
      // Garantir que o elemento de vídeo está limpo antes de definir uma nova stream
      if (video.srcObject) {
        video.srcObject = null;
        video.load();
      }
      
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      
      try {
        // Primeiro, forçar o carregamento do vídeo
        video.load();
        
        // Então tentar reproduzir
        console.log("Trying to play video");
        await video.play().catch(error => {
          console.warn("Initial play failed, will retry:", error);
          
          // Tentar novamente após um pequeno delay
          setTimeout(() => {
            if (video && mountedRef.current) {
              console.log("Retrying video play");
              video.play().catch(e => console.error("Retry play also failed:", e));
            }
          }, 1000);
        });
        
        // Adicionar logs para verificar o estado do vídeo
        console.log("Video status after play attempt:", {
          readyState: video.readyState,
          paused: video.paused,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight
        });
      } catch (error) {
        console.error("Error during video play:", error);
        // Continue mesmo que o play falhe, alguns navegadores móveis requerem interação do usuário
      }
    }
    
    return stream;
  } catch (error) {
    console.error("Error getting user media:", error);
    throw error;
  }
};

export const setupVideoElement = (
  video: HTMLVideoElement, 
  stream: MediaStream
): void => {
  if (video.srcObject) {
    video.srcObject = null;
    video.load();
  }
  
  video.srcObject = stream;
  video.style.width = "100%";
  video.style.height = "100%";
  
  // Garantir que o vídeo está configurado corretamente para reprodução automática
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  
  // Forçar o carregamento e a reprodução
  video.load();
  setTimeout(() => {
    video.play().catch(e => console.log("Error in setupVideoElement play:", e));
  }, 100);
};

export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const maxWaitTime = 8000; // Increased timeout to 8 seconds
    const startTime = Date.now();
    
    // Verificar se o vídeo já está pronto
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Video already has dimensions:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    // Verificar se o vídeo está em um estado de reprodução aceitável
    if (video.readyState >= 2) {
      console.log("Video has acceptable readyState:", video.readyState);
      resolve(true);
      return;
    }
    
    const checkReady = () => {
      // Verificar se temos dimensões
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log("Video is ready with dimensions:", video.videoWidth, "x", video.videoHeight);
        resolve(true);
        return;
      }
      
      // Verificar o estado de reprodução
      if (video.readyState >= 2) {
        console.log("Video ready with readyState:", video.readyState);
        resolve(true);
        return;
      }
      
      // Verificar timeout
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Video ready timeout exceeded, forcing ready state");
        
        // Forçar a reprodução uma última vez
        try {
          video.play().catch(e => console.log("Timeout play attempt failed:", e));
        } catch (e) {
          console.log("Error in timeout play attempt:", e);
        }
        
        resolve(true);
        return;
      }
      
      // Verificar novamente em breve
      setTimeout(checkReady, 200);
    };
    
    // Registrar event listeners
    const eventHandler = () => {
      console.log("Video ready event fired");
      resolve(true);
    };
    
    video.addEventListener('loadeddata', eventHandler, { once: true });
    video.addEventListener('loadedmetadata', eventHandler, { once: true });
    video.addEventListener('canplay', eventHandler, { once: true });
    video.addEventListener('playing', eventHandler, { once: true });
    
    // Iniciar a verificação periódica
    checkReady();
  });
};

// Nova função para tentar várias abordagens para iniciar o vídeo
export const ensureVideoPlaying = (video: HTMLVideoElement): void => {
  if (!video) return;
  
  console.log("Ensuring video is playing, current state:", {
    readyState: video.readyState,
    paused: video.paused,
    srcObject: !!video.srcObject
  });
  
  if (video.paused && video.srcObject) {
    // Tentar reproduzir imediatamente
    video.play().catch(e => {
      console.log("Initial ensure play failed:", e);
      
      // Tentar novamente com atraso
      setTimeout(() => {
        if (video) {
          console.log("Retrying video play");
          video.play().catch(e2 => {
            console.log("Retry also failed:", e2);
            
            // Última tentativa com interação simulada
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      }, 1000);
    });
  }
}
