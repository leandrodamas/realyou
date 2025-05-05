
import { useState } from "react";
import { ProfileImageState } from "./types";

/**
 * Hook for managing profile image state
 */
export const useProfileImageState = (initialImage: string | null = null) => {
  const [state, setState] = useState<ProfileImageState>({
    profileImage: initialImage,
    isUploading: false
  });
  
  const setProfileImage = (imageUrl: string | null) => {
    setState(prev => ({ ...prev, profileImage: imageUrl }));
  };
  
  const setUploadingState = (isUploading: boolean) => {
    setState(prev => ({ ...prev, isUploading }));
  };
  
  return {
    ...state,
    setProfileImage,
    setUploadingState
  };
};
