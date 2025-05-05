
/**
 * Utility for generating unique filenames
 */
export const generateUniqueFilename = (file: File): string => {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomString}.${fileExt}`;
};
