
/**
 * User profile type definition
 */
export interface UserProfile {
  id: string;
  userId: string;
  username?: string;
  fullName?: string;
  title?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  avatar_url?: string;
  postCount?: number;
  connectionCount?: number;
  skillsCount?: number;
  lastUpdated: string;
  createdAt?: string;
  basePrice?: number;
  currency?: string;
  faceRegistered?: boolean;
  registrationTimestamp?: string;
  location?: string;
  [key: string]: any;
}
