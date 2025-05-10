
import { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

export interface FaceCaptureProps {
  onCaptureImage?: (imageData: string) => void;
  capturedImage?: string | null;
  setCapturedImage?: (image: string | null) => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
  isRegistrationMode?: boolean;
}

export interface UseFaceCaptureStateProps {
  onCaptureImage?: (imageData: string) => void;
  capturedImage?: string | null;
  setCapturedImage?: (image: string | null) => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
}

export interface FaceCaptureState {
  isCameraActive: boolean;
  capturedImage: string | null;
  isSearching: boolean;
  matchedPerson: MatchedPerson | null;
  noMatchFound: boolean;
  connectionSent: boolean;
  showScheduleDialog: boolean;
  attemptingCameraAccess: boolean;
  handleStartCamera: () => void;
  handleCapture: () => void;
  handleReset: () => void;
  handleSearch: (image: string) => Promise<void>;
  sendConnectionRequest: () => void;
  setShowScheduleDialog: (show: boolean) => void;
  setNoMatchFound: (value: boolean) => void;
}
