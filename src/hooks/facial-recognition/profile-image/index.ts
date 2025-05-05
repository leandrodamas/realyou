
// Re-export all hooks and types from the profile image module
export * from './types';
export * from './useProfileImageState';
export * from './useProfileImageUpload';
export * from './useFaceRecognitionRegistration';

// For backward compatibility, re-export the main hook with the original name
import { useProfileImageUpload } from './useProfileImageUpload';
import { useFaceRecognitionRegistration } from './useFaceRecognitionRegistration';
import { useProfileImageState } from './useProfileImageState';

/**
 * Combined hook that provides the same API as the original useProfileImageUpload
 * for backward compatibility
 */
export const useProfileImage = () => {
  const { 
    profileImage, 
    isUploading, 
    setProfileImage, 
    uploadProfileImage 
  } = useProfileImageUpload();
  
  const { registerProfileImageWithFaceID } = useFaceRecognitionRegistration();
  
  return {
    profileImage,
    setProfileImage,
    uploadProfileImage,
    registerProfileImageWithFaceID,
    isUploading
  };
};
