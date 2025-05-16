
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
