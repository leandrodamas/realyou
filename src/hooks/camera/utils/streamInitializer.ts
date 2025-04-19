
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Inicializando câmera com configurações:", JSON.stringify(constraints));
  
  // Force use of exact deviceId if available
  if ((constraints.video as MediaTrackConstraints)?.deviceId) {
    console.log("Usando deviceId específico para câmera");
  }
  
  // Define configurações para tentativas múltiplas
  const attemptConfigurations = [
    // Configuração 1: configurações fornecidas pelo usuário
    constraints,
    
    // Configuração 2: configurações simplificadas mas mantendo o facingMode
    {
      audio: false,
      video: {
        facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user'
      }
    },
    
    // Configuração 3: configuração básica com menor resolução
    {
      audio: false,
      video: {
        facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    },
    
    // Configuração 4: resolução muito baixa para dispositivos com limitações
    {
      audio: false,
      video: {
        facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user',
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    },
    
    // Configuração 5: tenta qualquer câmera disponível
    {
      audio: false,
      video: {}
    },
    
    // Configuração 6: última tentativa - configurações mínimas
    {
      audio: false,
      video: true
    }
  ];
  
  try {
    // Primeiro, limpar qualquer stream anterior
    if (videoRef.current && videoRef.current.srcObject) {
      const oldStream = videoRef.current.srcObject as MediaStream;
      cleanupCameraStream(oldStream, videoRef.current);
    }

    // Detectar o tipo de dispositivo para configurações específicas
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    const isFirefox = /Firefox/i.test(navigator.userAgent);
    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent);
    
    // Adicionar configurações específicas para navegadores problemáticos
    if (isIOS && isSafari) {
      // iOS Safari tem problemas específicos
      attemptConfigurations.unshift({
        audio: false,
        video: {
          facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        }
      });
    } else if (isAndroid) {
      // Android tem necessidades específicas
      attemptConfigurations.unshift({
        audio: false,
        video: {
          facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        }
      });
      
      if (isFirefox) {
        // Firefox no Android tem problemas específicos
        attemptConfigurations.unshift({
          audio: false,
          video: {
            facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user',
            width: { ideal: 320, max: 640 },
            height: { ideal: 240, max: 480 }
          }
        });
      }
    }
    
    // Forçar permissões em contexto de toque em dispositivos móveis
    if (isMobile) {
      // Em iOS/Android, recomenda-se solicitar permissão após um toque do usuário
      // Este código será executado pelo nosso fluxo que garante um toque antes
      console.log("Solicitando permissões em contexto de interação em dispositivo móvel");
    }
    
    // Tentar obter lista de dispositivos antes (pode ajudar a "acordar" as APIs)
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log(`Dispositivos de vídeo disponíveis: ${videoDevices.length}`);
      
      // Tentar usar o dispositivo correto se houver mais de um
      if (videoDevices.length > 0 && !(constraints.video as MediaTrackConstraints)?.deviceId) {
        console.log("Adicionando configuração com deviceId específico");
        const preferredDevice = videoDevices[0].deviceId;
        attemptConfigurations.unshift({
          audio: false,
          video: {
            deviceId: { exact: preferredDevice },
            facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user'
          }
        });
      }
    } catch (err) {
      console.warn("Erro ao enumerar dispositivos:", err);
    }

    // Tentar cada configuração até uma funcionar
    let lastError = null;
    for (let i = 0; i < attemptConfigurations.length; i++) {
      const config = attemptConfigurations[i];
      
      try {
        console.log(`Tentativa ${i + 1}/${attemptConfigurations.length} com configuração:`, JSON.stringify(config));
        
        // Para dispositivos móveis, adicionar pequeno atraso pode ajudar
        if (isMobile && i > 0) {
          await new Promise(r => setTimeout(r, 300));
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(config);
        
        if (!mountedRef.current) {
          console.log("Componente desmontado, limpando stream");
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        
        console.log(`Stream obtido com sucesso na tentativa ${i + 1}`);
        const videoTracks = stream.getVideoTracks();
        
        if (videoTracks.length > 0) {
          console.log("Detalhes da track de vídeo:", {
            label: videoTracks[0].label,
            id: videoTracks[0].id,
            enabled: videoTracks[0].enabled,
            readyState: videoTracks[0].readyState
          });
          
          // Tentar aplicar restrições adicionais que podem ajudar em alguns dispositivos
          try {
            await videoTracks[0].applyConstraints({
              advanced: [
                { autoFocus: true },
                { exposureMode: "continuous" }
              ]
            });
          } catch (e) {
            // Ignora erros em applyConstraints pois nem todos dispositivos suportam
            console.log("Constraints adicionais não suportadas:", e);
          }
        }
        
        // For iOS, add an extra debugging step
        if (isIOS) {
          const tracks = stream.getVideoTracks();
          console.log(`iOS camera tracks:`, tracks.length, tracks.map(t => t.label));
          
          // Force a small delay to let iOS camera initialize properly
          await new Promise(r => setTimeout(r, 500));
        }
        
        return stream;
      } catch (error) {
        console.log(`Erro na tentativa ${i + 1}:`, error);
        lastError = error;
        
        // Wait a moment before trying the next configuration
        await new Promise(r => setTimeout(r, 300));
        
        // Check if component is still mounted
        if (!mountedRef.current) {
          console.log("Componente desmontado durante tentativas");
          return null;
        }
      }
    }
    
    // Se chegou até aqui, todas as tentativas falharam
    console.error("Todas as tentativas de acessar a câmera falharam. Último erro:", lastError);
    throw lastError || new Error("Failed to access camera after multiple attempts");
  } catch (error: any) {
    console.error("Erro ao obter mídia do usuário:", error);
    throw error;
  }
};
