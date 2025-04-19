
import { RefObject } from "react";

export interface DeviceDetectionState {
  hasCamera: boolean;
  checkCameraAvailability: () => Promise<boolean>;
}

export interface CameraAccessState {
  videoRef: RefObject<HTMLVideoElement>;
  streamRef: RefObject<MediaStream | null>;
  isLoading: boolean;
  isVideoReady: boolean;
  setIsLoading: (loading: boolean) => void;
  initializeCamera: (constraints: MediaStreamConstraints) => Promise<MediaStream | null>;
  mountedRef: RefObject<boolean>;
}

export interface CameraErrorState {
  hasError: boolean;
  lastErrorMessage: string | null;
  retryCountRef: RefObject<number>;
  handleCameraError: (error: any) => void;
  resetError: () => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
}

export interface CameraStreamState {
  videoRef: RefObject<HTMLVideoElement>;
  hasError: boolean;
  switchCamera: () => void;
  facingMode: "user" | "environment";
  hasCamera: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  lastErrorMessage: string | null;  
  isVideoReady: boolean;
  faceDetected: boolean;
}
