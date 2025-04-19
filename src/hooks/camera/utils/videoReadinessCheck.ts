
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
        resolve(true);
        return;
      }
      
      // Se o vídeo tem dimensões ou readyState adequado, está pronto
      if (video.videoWidth > 0 && video.videoHeight > 0 || video.readyState >= 2) {
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

    // Configurar event listeners para verificar se o vídeo está pronto
    const handleVideoReady = () => {
      console.log("Evento de vídeo pronto acionado");
      resolve(true);
    };
    
    video.addEventListener('loadeddata', handleVideoReady, { once: true });
    video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
    video.addEventListener('canplay', handleVideoReady, { once: true });
    
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
  
  // Add event listeners
  video.addEventListener('loadeddata', readyHandler, { once: true });
  video.addEventListener('loadedmetadata', readyHandler, { once: true });
  video.addEventListener('canplay', readyHandler, { once: true });
  
  // Start periodic checking
  const intervalId = setInterval(() => {
    // Check if video is ready
    if (isVideoReady(video)) {
      clearInterval(intervalId);
      onReady();
      return;
    }
    
    // Check if we've exceeded the maximum wait time
    if (Date.now() - startTime > maxWaitTime) {
      clearInterval(intervalId);
      console.log("Video readiness timeout exceeded");
      onReady();
      return;
    }
  }, 500);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    video.removeEventListener('loadeddata', readyHandler);
    video.removeEventListener('loadedmetadata', readyHandler);
    video.removeEventListener('canplay', readyHandler);
  };
};
