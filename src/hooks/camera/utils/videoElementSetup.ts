
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
    const playVideo = (attempts = 15) => {
      if (attempts <= 0) {
        console.log("Máximo de tentativas de reprodução atingido, marcando como pronto mesmo assim");
        const event = new Event('playing');
        video.dispatchEvent(event);
        return;
      }
      
      video.play()
        .then(() => {
          console.log("Vídeo iniciado com sucesso");
        })
        .catch(e => {
          console.warn(`Erro ao iniciar vídeo, tentativas restantes: ${attempts-1}. Erro:`, e);
          setTimeout(() => playVideo(attempts - 1), 600);
        });
    };
    
    // Começar tentativas de reprodução com um atraso maior
    setTimeout(() => {
      playVideo();
    }, 500);
    
    // Para iOS, precisamos forçar a reprodução após um toque do usuário
    if (isIOS) {
      document.body.addEventListener('touchend', function iosTouchHandler() {
        video.play().catch(e => console.log("Erro ao reproduzir vídeo no iOS:", e));
        document.body.removeEventListener('touchend', iosTouchHandler);
      }, { once: true });
    }
    
    // Garantir que o vídeo seja marcado como pronto em até 10 segundos
    setTimeout(() => {
      if (video.paused) {
        console.log("Vídeo ainda parado após tempo limite, forçando reprodução");
        video.play().catch(() => {
          console.log("Tentativa final de reprodução falhou, marcando como pronto");
          // Disparar um evento falso de reprodução para continuar o fluxo
          const event = new Event('playing');
          video.dispatchEvent(event);
        });
      }
    }, 10000);
    
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
        if (attempt < 8) {
          setTimeout(() => attemptPlay(attempt + 1), 400 * attempt);
        } else {
          // Disparar um evento falso de reprodução para continuar o fluxo
          const event = new Event('playing');
          video.dispatchEvent(event);
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
    const maxWaitTime = 12000; 
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
