
export const setupVideoElement = (
  video: HTMLVideoElement, 
  stream: MediaStream
): void => {
  try {
    console.log("Configurando elemento de vídeo com stream");
    
    // Limpeza completa de qualquer stream anterior
    if (video.srcObject) {
      try {
        video.pause();
        video.srcObject = null;
        video.load();
      } catch (e) {
        console.error("Erro ao limpar vídeo:", e);
      }
    }
    
    // Força o vídeo a parar completamente qualquer atividade anterior
    video.pause();
    
    // Configurar todos os atributos críticos para compatibilidade cross-browser
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
    
    // Tentar reproduzir o vídeo imediatamente
    video.play().then(() => {
      console.log("Vídeo iniciado com sucesso");
    }).catch(e => {
      console.warn("Erro ao iniciar vídeo na primeira tentativa:", e);
      
      // Se falhar no play inicial, tentar criar um manipulador de eventos para o próximo toque
      const handleUserInteraction = () => {
        video.play().catch(err => console.log("Erro ao reproduzir vídeo após interação:", err));
        ['touchend', 'click', 'keydown'].forEach(event => {
          document.removeEventListener(event, handleUserInteraction);
        });
      };
      
      // Adicionar ouvintes para qualquer interação do usuário
      ['touchend', 'click', 'keydown'].forEach(event => {
        document.addEventListener(event, handleUserInteraction, { once: true });
      });
      
      // Tentar novamente após um breve atraso
      setTimeout(() => {
        playVideo(12);
      }, 800);
    });
    
    // Função para tentar reproduzir o vídeo múltiplas vezes
    function playVideo(attempts = 5) {
      if (attempts <= 0) {
        console.log("Número máximo de tentativas de reprodução atingido");
        return;
      }
      
      if (video.paused && video.srcObject) {
        console.log(`Tentativa ${5-attempts+1} de iniciar vídeo`);
        video.play().then(() => {
          console.log(`Vídeo iniciado com sucesso na tentativa ${5-attempts+1}`);
        }).catch(e => {
          console.warn(`Erro na tentativa ${5-attempts+1}:`, e);
          setTimeout(() => playVideo(attempts - 1), 800);
        });
      }
    }
    
    // Garantir que o vídeo seja marcado como pronto após tempo limite
    setTimeout(() => {
      if (video.paused && video.srcObject) {
        console.log("Vídeo ainda parado após tempo limite, forçando reprodução final");
        video.play().catch(() => {
          console.log("Tentativa final de reprodução falhou, considerando como pronto mesmo assim");
        });
      }
    }, 5000);
    
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
    // Tentar reproduzir diretamente
    video.play().catch(e => {
      console.log(`Tentativa de reprodução falhou:`, e);
      
      // Se falhou, tentar criar um botão invisível para acionar o play
      const invisibleButton = document.createElement('button');
      invisibleButton.style.position = 'fixed';
      invisibleButton.style.bottom = '0';
      invisibleButton.style.opacity = '0.01';
      invisibleButton.style.width = '100px';
      invisibleButton.style.height = '50px';
      invisibleButton.textContent = 'Iniciar vídeo';
      
      invisibleButton.onclick = () => {
        video.play().catch(() => {});
        document.body.removeChild(invisibleButton);
      };
      
      document.body.appendChild(invisibleButton);
      setTimeout(() => {
        if (document.body.contains(invisibleButton)) {
          invisibleButton.click();
          setTimeout(() => {
            if (document.body.contains(invisibleButton)) {
              document.body.removeChild(invisibleButton);
            }
          }, 1000);
        }
      }, 500);
    });
    
    // Configurar atributos críticos novamente
    video.setAttribute("playsinline", "true");
    video.setAttribute("autoplay", "true");
    video.setAttribute("muted", "true");
    video.muted = true;
  }
};

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
