
export interface AdvancedMediaTrackConstraint {
  autoFocus?: boolean;
  exposureMode?: string;
  [key: string]: any;
}

export interface StreamConfiguration {
  audio: false;
  video: MediaTrackConstraints;
}

export interface StreamInitializerOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  mountedRef: React.RefObject<boolean>;
  constraints: MediaStreamConstraints;
}
