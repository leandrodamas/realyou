
export interface UserProfile {
  userId: string;
  username: string;
  lastUpdated: string;
}

export const initializeUserProfile = (userId: string, email: string | undefined): void => {
  const savedProfile = localStorage.getItem('userProfile');
  
  if (!savedProfile) {
    const initialProfile: UserProfile = {
      userId: userId,
      username: email?.split('@')[0] || 'user',
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('userProfile', JSON.stringify(initialProfile));
  }
};

export const clearUserProfile = (): void => {
  localStorage.removeItem('userProfile');
};
