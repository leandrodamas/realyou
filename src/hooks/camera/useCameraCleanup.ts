
import { useEffect } from "react";

/**
 * Hook that handles camera cleanup on unmount or deactivation
 */
export const useCameraCleanup = (
  isCameraActive: boolean,
  streamRef: React.MutableRefObject<MediaStream | null>,
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  useEffect(() => {
    // Cleanup function to stop camera when component unmounts or camera is deactivated
    return () => {
      if (streamRef.current) {
        console.log("useCameraCleanup: Limpando stream da câmera");
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
            console.log("useCameraCleanup: Trilha parada:", track.kind);
          } catch (e) {
            console.error("useCameraCleanup: Erro ao parar trilha:", e);
          }
        });
      }
      
      if (videoRef.current) {
        try {
          videoRef.current.srcObject = null;
        } catch (e) {
          console.error("useCameraCleanup: Erro ao limpar srcObject:", e);
        }
      }
    };
  }, [isCameraActive]);
};
