
/**
 * Utility to wait until a video element is ready to be used
 */
export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    // Tempo máximo de espera para vídeo estar pronto
    const maxWaitTime = 10000; 
    const startTime = Date.now();
    
    // Se o vídeo já tem dimensões, está pronto
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Vídeo já tem dimensões:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    // Função para verificar se o vídeo está pronto
    const checkReady = () => {
      // Se já excedemos o tempo máximo, consideramos pronto mesmo assim
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Tempo limite de vídeo pronto excedido, forçando estado pronto");
        
        // Uma última tentativa de reprodução
        if (video.paused && video.srcObject) {
          try {
            video.play().catch(() => {});
          } catch (e) {
            console.log("Erro na tentativa final de reprodução:", e);
          }
        }
        
        resolve(true);
        return;
      }
      
      // Se o vídeo tem dimensões ou readyState adequado, está pronto
      if ((video.videoWidth > 0 && video.videoHeight > 0) || video.readyState >= 2) {
        console.log("Vídeo está pronto:", {
          width: video.videoWidth,
          height: video.videoHeight,
          readyState: video.readyState
        });
        resolve(true);
        return;
      }
      
      // Caso contrário, verificar novamente em um momento
      setTimeout(checkReady, 300);
    };

    // Configurar múltiplos event listeners para detecção de prontidão
    const handleVideoReady = () => {
      console.log("Evento de vídeo pronto acionado");
      resolve(true);
    };
    
    // Tentar múltiplos eventos para máxima compatibilidade
    video.addEventListener('loadeddata', handleVideoReady, { once: true });
    video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
    video.addEventListener('canplay', handleVideoReady, { once: true });
    video.addEventListener('playing', handleVideoReady, { once: true });
    
    // Se o vídeo já estiver sendo reproduzido, verificar se tem dimensões
    if (!video.paused && video.srcObject) {
      const checkDimensions = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          resolve(true);
          return;
        }
        
        // Verificar algumas vezes
        if (Date.now() - startTime < maxWaitTime / 2) {
          setTimeout(checkDimensions, 300);
        }
      };
      
      checkDimensions();
    }
    
    // Também iniciar a verificação de polling
    checkReady();
  });
};

/**
 * Check if a video is ready for usage
 */
export const isVideoReady = (video: HTMLVideoElement | null): boolean => {
  if (!video) return false;
  return video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2;
};

/**
 * Monitor a video element until it's ready
 */
export const monitorVideoReadiness = (
  video: HTMLVideoElement | null, 
  onReady: () => void,
  maxWaitTime: number = 10000
): () => void => {
  if (!video) return () => {};
  
  // Current time tracking
  const startTime = Date.now();
  
  // Event handlers
  const readyHandler = () => onReady();
  
  // Add event listeners for multiple events to maximize chances of detection
  video.addEventListener('loadeddata', readyHandler, { once: true });
  video.addEventListener('loadedmetadata', readyHandler, { once: true });
  video.addEventListener('canplay', readyHandler, { once: true });
  video.addEventListener('playing', readyHandler, { once: true });
  video.addEventListener('play', readyHandler, { once: true });
  
  // Start periodic checking
  const intervalId = setInterval(() => {
    // Check if video is ready
    if (isVideoReady(video)) {
      clearInterval(intervalId);
      onReady();
      return;
    }
    
    // Check if video is playing but readyState is not yet 3-4
    if (video.srcObject && !video.paused && video.currentTime > 0) {
      // If playing but not fully ready, consider it ready enough
      if (Date.now() - startTime > maxWaitTime / 2) {
        clearInterval(intervalId);
        onReady();
        return;
      }
    }
    
    // Check if we've exceeded the maximum wait time
    if (Date.now() - startTime > maxWaitTime) {
      clearInterval(intervalId);
      console.log("Video readiness timeout exceeded, forcing state to ready");
      onReady();
      return;
    }
    
    // Try to play the video if it's paused but has source
    if (video.paused && video.srcObject) {
      try {
        video.play().catch(() => {});
      } catch (e) {
        console.log("Erro ao tentar iniciar vídeo durante monitoramento:", e);
      }
    }
  }, 300);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    video.removeEventListener('loadeddata', readyHandler);
    video.removeEventListener('loadedmetadata', readyHandler);
    video.removeEventListener('canplay', readyHandler);
    video.removeEventListener('playing', readyHandler);
    video.removeEventListener('play', readyHandler);
  };
};
