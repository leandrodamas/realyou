
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

export interface FacialRecognitionState {
  isSearching: boolean;
  matchedPerson: MatchedPerson | null;
  noMatchFound: boolean;
  connectionSent: boolean;
  hasError: boolean;
}

export interface UseFacialRecognitionResult extends FacialRecognitionState {
  handleSearch: (profileImage: string) => Promise<void>;
  registerFace: (imageData: string, userId?: string) => Promise<boolean>;
  sendConnectionRequest: () => void;
  setNoMatchFound: (value: boolean) => void;
  setMatchedPerson: (person: MatchedPerson | null) => void;
  resetState: () => void;
}
