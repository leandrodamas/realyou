export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    // Se o vídeo já tem dimensões, está pronto
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Vídeo já tem dimensões:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    // Tempo máximo de espera para vídeo estar pronto
    const maxWaitTime = 8000; 
    const startTime = Date.now();
    
    // Função para verificar se o vídeo está pronto
    const checkReady = () => {
      // Se já excedemos o tempo máximo, consideramos pronto mesmo assim
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Tempo limite de vídeo pronto excedido, forçando estado pronto");
        
        // Uma última tentativa
        if (video.paused && video.srcObject) {
          video.play().catch(() => {});
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

    // Configurar event listeners para verificar se o vídeo está pronto
    const handleVideoReady = () => {
      console.log("Evento de vídeo pronto acionado");
      resolve(true);
    };
    
    video.addEventListener('loadeddata', handleVideoReady, { once: true });
    video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
    video.addEventListener('canplay', handleVideoReady, { once: true });
    video.addEventListener('playing', handleVideoReady, { once: true });
    
    // Também iniciar a verificação de polling
    checkReady();
  });
};
