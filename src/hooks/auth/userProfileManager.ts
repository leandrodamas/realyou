
/**
 * @deprecated This file is being refactored. Please import from src/hooks/auth/profile instead.
 */

export { 
  initializeUserProfile,
  refreshUserProfile,
  dispatchProfileUpdate,
  syncProfileWithSupabase,
  clearUserProfile
} from './profile';
export type { UserProfile } from './profile/types';
