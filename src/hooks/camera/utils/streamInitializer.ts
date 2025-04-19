
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

    // Detectar o tipo de dispositivo para configurações específicas
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    // Usar configurações mais simples para tentar primeiro
    let simplifiedConstraints: MediaStreamConstraints = {
      audio: false,
      video: true
    };
    
    console.log("Tentando inicializar câmera com configurações básicas:", JSON.stringify(simplifiedConstraints));
    
    try {
      // Primeiro tentar com configurações básicas
      const stream = await navigator.mediaDevices.getUserMedia(simplifiedConstraints);
      
      if (!mountedRef.current) {
        console.log("Componente desmontado, limpando stream");
        stream.getTracks().forEach(track => track.stop());
        return null;
      }
      
      console.log("Stream obtido com sucesso usando configurações básicas");
      return stream;
    } catch (basicError) {
      console.log("Falha na configuração básica, tentando com configurações específicas:", basicError);
      
      // Se falhar, tentar com configurações específicas para o dispositivo
      let deviceSpecificConstraints: MediaStreamConstraints = constraints;
      
      if (isIOS) {
        deviceSpecificConstraints = {
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 320, max: 640 },
            height: { ideal: 240, max: 480 }
          }
        };
      } else if (isAndroid) {
        deviceSpecificConstraints = {
          audio: false,
          video: {
            facingMode: 'user'
          }
        };
      }
      
      console.log("Tentando com configurações específicas do dispositivo:", JSON.stringify(deviceSpecificConstraints));
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(deviceSpecificConstraints);
        
        if (!mountedRef.current) {
          console.log("Componente desmontado, limpando stream");
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        
        console.log("Stream obtido com sucesso usando configurações específicas do dispositivo");
        return stream;
      } catch (specificError) {
        console.log("Falha nas configurações específicas, tentando configurações mínimas", specificError);
        
        // Última tentativa com configurações mínimas
        const minimalConstraints: MediaStreamConstraints = {
          audio: false,
          video: true
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(minimalConstraints);
        
        if (!mountedRef.current) {
          console.log("Componente desmontado, limpando stream");
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        
        console.log("Stream obtido com sucesso usando configurações mínimas");
        return stream;
      }
    }
  } catch (error: any) {
    console.error("Erro ao obter mídia do usuário:", error);
    
    // Relançar o erro com mais informações
    throw error;
  }
};
