
export interface MatchedPerson {
  name: string;
  title?: string; // Adding title property to match usage
  profession: string;
  avatar: string;
  connectionStatus?: 'not_connected' | 'pending' | 'connected';
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
