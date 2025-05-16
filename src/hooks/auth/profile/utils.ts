
import { UserProfile } from "./types";

export const isEmptyProfile = (profile: UserProfile | null): boolean => {
  return !profile || Object.keys(profile).length <= 2;
};

export const hasRequiredFields = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  
  return (
    !!profile.id &&
    !!profile.userId &&
    !!profile.lastUpdated
  );
};

export const isProfileComplete = (profile: UserProfile | null): boolean => {
  if (!hasRequiredFields(profile)) return false;
  
  return (
    !!profile.fullName &&
    !!profile.profileImage 
  );
};

/**
 * Utility function to retry async operations with exponential backoff
 * @param operation The async operation to retry
 * @param maxRetries Maximum number of retry attempts
 * @returns Result of the operation
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // For the first attempt (attempt=0), try immediately
      if (attempt > 0) {
        // For subsequent attempts, wait with exponential backoff
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Operation attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }
  
  // This should never be reached, but TypeScript requires a return statement
  throw lastError || new Error('Unknown error in retry mechanism');
};
