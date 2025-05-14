
import { UserProfile } from "./types";

/**
 * Dispatches a profile update event
 * @param profile User profile data
 */
export const dispatchProfileUpdate = (profile: UserProfile): void => {
  try {
    const event = new CustomEvent('profileUpdated', { 
      detail: { profile } 
    });
    document.dispatchEvent(event);
    console.log("Profile update event dispatched:", profile);
  } catch (error) {
    console.error("Error dispatching profile update event:", error);
  }
};
