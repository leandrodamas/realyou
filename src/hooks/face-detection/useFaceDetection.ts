
import { useDetectionState } from './useDetectionState';
import { useDetectionInterval } from './useDetectionInterval';

interface UseFaceDetectionProps {
  isCameraActive: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady?: boolean;
}

export const useFaceDetection = ({
  isCameraActive,
  isInitializing,
  isLoading,
  videoRef,
  isVideoReady = false
}: UseFaceDetectionProps) => {
  const { faceDetected, updateDetectionState, resetDetectionState } = useDetectionState();
  
  useDetectionInterval({
    isCameraActive,
    isInitializing,
    isLoading,
    videoRef,
    isVideoReady,
    onDetectionUpdate: updateDetectionState
  });

  return { faceDetected };
};
