
export const setupVideoElement = (
  video: HTMLVideoElement, 
  stream: MediaStream
): void => {
  if (video.srcObject) {
    video.srcObject = null;
    video.load();
  }
  
  // Desconectar listeners existentes para evitar vazamentos de memória
  const cloneVideo = video.cloneNode() as HTMLVideoElement;
  if (video.parentNode) {
    video.parentNode.replaceChild(cloneVideo, video);
    video = cloneVideo;
  }
  
  video.srcObject = stream;
  video.style.width = "100%";
  video.style.height = "100%";
  
  // Configurar todos os atributos importantes
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  
  // Também definir atributos diretamente para garantir melhor compatibilidade com navegadores
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  
  // Forçar carregamento e reprodução com um pequeno atraso para melhor compatibilidade
  video.load();
  
  // Para iOS, precisamos forçar a reprodução após um toque do usuário
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isIOS) {
    document.body.addEventListener('touchend', function iosTouchHandler() {
      video.play().catch(e => console.log("Erro ao reproduzir vídeo no iOS:", e));
      document.body.removeEventListener('touchend', iosTouchHandler);
    }, { once: true });
  }
  
  setTimeout(() => {
    video.play().catch(e => {
      console.log("Erro em setupVideoElement play:", e);
      // Repetir reprodução após um curto atraso
      setTimeout(() => {
        video.play().catch(e2 => console.log("Segunda tentativa de reprodução falhou:", e2));
      }, 500);
    });
  }, 100);
};

export const ensureVideoPlaying = (video: HTMLVideoElement): void => {
  if (!video) return;
  
  console.log("Garantindo que o vídeo está sendo reproduzido, estado atual:", {
    readyState: video.readyState,
    paused: video.paused,
    srcObject: !!video.srcObject
  });
  
  if (video.paused && video.srcObject) {
    const tryPlay = () => {
      video.play().catch(e => {
        console.log("Reprodução falhou em ensureVideoPlaying:", e);
      });
    };

    // Tentar múltiplas vezes com atrasos crescentes
    tryPlay();
    
    // Definir todos os atributos críticos
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.muted = true;
    
    setTimeout(tryPlay, 300);
    setTimeout(tryPlay, 1000);
  }
};

export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    // Tempo máximo de espera para vídeo estar pronto (3 segundos)
    const maxWaitTime = 3000; 
    const startTime = Date.now();
    
    // Se o vídeo já tem dimensões, está pronto
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Vídeo já tem dimensões:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    // Função para verificar se o vídeo está pronto
    const checkReady = () => {
      // Se o vídeo tem dimensões, está pronto
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log("Vídeo tem dimensões agora:", video.videoWidth, "x", video.videoHeight);
        resolve(true);
        return;
      }
      
      // Se o readyState do vídeo é pelo menos HAVE_CURRENT_DATA (2), está pronto
      if (video.readyState >= 2) {
        console.log("Vídeo está pronto com readyState:", video.readyState);
        resolve(true);
        return;
      }
      
      // Verificar se excedemos o tempo máximo de espera
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Tempo limite de vídeo pronto excedido, forçando estado pronto");
        resolve(true);
        return;
      }
      
      // Caso contrário, verificar novamente em um momento
      setTimeout(checkReady, 100);
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
