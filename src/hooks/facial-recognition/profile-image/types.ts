
/**
 * Types for profile image handling functionality
 */

export interface ProfileImageState {
  profileImage: string | null;
  isUploading: boolean;
}

export interface ProfileImageRegistrationResult {
  success: boolean;
  imageUrl?: string;
  error?: Error;
}
