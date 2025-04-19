export const setupVideoElement = (
  video: HTMLVideoElement, 
  stream: MediaStream
): void => {
  try {
    console.log("Configurando elemento de vídeo com stream");
    
    // Limpeza completa de qualquer stream anterior
    if (video.srcObject) {
      video.pause();
      video.srcObject = null;
      video.load();
    }
    
    // Configurar stream e todos os atributos importantes
    video.srcObject = stream;
    video.style.width = "100%";
    video.style.height = "100%";
    video.setAttribute("playsinline", "true");
    video.setAttribute("muted", "true");
    video.setAttribute("autoplay", "true");
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    
    // Para iOS, configurar manualmente mais propriedades
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIOS) {
      video.setAttribute("webkit-playsinline", "true");
    }
    
    // Garantir que o vídeo seja carregado
    video.load();
    
    // Forçar reprodução com múltiplas tentativas e intervalo maior entre tentativas
    const playVideo = (attempts = 10) => {
      if (attempts <= 0) return;
      
      video.play()
        .then(() => {
          console.log("Vídeo iniciado com sucesso");
        })
        .catch(e => {
          console.warn(`Erro ao iniciar vídeo, tentativas restantes: ${attempts-1}. Erro:`, e);
          setTimeout(() => playVideo(attempts - 1), 500);
        });
    };
    
    // Começar tentativas de reprodução
    setTimeout(() => {
      playVideo();
    }, 300);
    
    // Para iOS, precisamos forçar a reprodução após um toque do usuário
    if (isIOS) {
      document.body.addEventListener('touchend', function iosTouchHandler() {
        video.play().catch(e => console.log("Erro ao reproduzir vídeo no iOS:", e));
        document.body.removeEventListener('touchend', iosTouchHandler);
      }, { once: true });
    }
  } catch (error) {
    console.error("Erro ao configurar elemento de vídeo:", error);
  }
};

export const ensureVideoPlaying = (video: HTMLVideoElement): void => {
  if (!video) return;
  
  console.log("Garantindo que o vídeo está sendo reproduzido, estado atual:", {
    readyState: video.readyState,
    paused: video.paused,
    srcObject: !!video.srcObject
  });
  
  if (video.paused && video.srcObject) {
    // Múltiplas tentativas com intervalos crescentes
    const attemptPlay = (attempt = 1) => {
      video.play().catch(e => {
        console.log(`Tentativa ${attempt} de reprodução falhou:`, e);
        if (attempt < 5) {
          setTimeout(() => attemptPlay(attempt + 1), 300 * attempt);
        }
      });
    };
    
    // Tentar reproduzir o vídeo várias vezes
    attemptPlay();
    
    // Definir todos os atributos críticos novamente
    video.setAttribute("playsinline", "true");
    video.setAttribute("autoplay", "true");
    video.setAttribute("muted", "true");
    video.muted = true;
  }
};

export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    // Tempo máximo de espera para vídeo estar pronto
    const maxWaitTime = 8000; 
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
        
        // Uma última tentativa
        if (video.paused && video.srcObject) {
          video.play().catch(e => console.log("Erro ao tentar reproduzir vídeo no timeout:", e));
        }
        
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
      setTimeout(checkReady, 200);
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
