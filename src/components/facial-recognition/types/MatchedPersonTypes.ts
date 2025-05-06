
export interface MatchedPerson {
  name: string;
  profession: string;
  avatar: string;
  schedule?: Array<ScheduleSlot>;
}

export interface ScheduleSlot {
  day: string;
  slots: string[];
  active: boolean;
}

export interface FaceCaptureProps {
  onCaptureImage?: (imageData: string) => void;
  capturedImage?: string | null;
  setCapturedImage?: (image: string | null) => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
  isRegistrationMode?: boolean;
}
