
/**
 * This file is maintained for backward compatibility.
 * It re-exports the refactored hook from the new location.
 */
import { useProfileImage } from './facial-recognition/profile-image';
export const useProfileImageUpload = useProfileImage;

// Re-export types if needed
export type { 
  ProfileImageState, 
  ProfileImageRegistrationResult 
} from './facial-recognition/profile-image';
