
export interface CameraAccessState {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  initializeCamera: (constraints: MediaStreamConstraints) => Promise<MediaStream | null>;
  mountedRef: React.RefObject<boolean>;
}

export interface DeviceDetectionState {
  hasCamera: boolean;
  checkCameraAvailability: () => Promise<boolean>;
}

export interface CameraErrorState {
  hasError: boolean;
  lastErrorMessage: string | null;
  retryCountRef: React.MutableRefObject<number>;
  handleCameraError: (error: unknown) => void;
  resetError: () => void;
}

export interface CameraStreamState {
  videoRef: React.RefObject<HTMLVideoElement>;
  hasError: boolean;
  switchCamera: () => void;
  facingMode: "user" | "environment";
  hasCamera: boolean;
  isLoading: boolean;
  lastErrorMessage: string | null;
}
