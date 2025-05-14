
/**
 * Shared types for user profile management
 */

export interface UserProfile {
  userId: string;
  id: string;
  username?: string;
  fullName?: string;
  avatar_url?: string;
  lastUpdated: string;
  profileImage?: string;
  basePrice?: number;
  currency?: string;
  title?: string;
}

// Maximum number of retries for profile operations
export const MAX_RETRIES = 3;
