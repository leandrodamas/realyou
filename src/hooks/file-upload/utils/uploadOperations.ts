
import { supabase } from "@/integrations/supabase/client";

/**
 * Performs the actual file upload to Supabase storage
 */
export const performFileUpload = async (
  file: File,
  filePath: string,
  bucketName: string,
  metadata: Record<string, string>
): Promise<{ error: Error | null; data: any }> => {
  console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);
  console.log(`File type: ${file.type}, size: ${file.size} bytes`);
  
  // Upload options without upsert to avoid RLS conflicts
  const uploadOptions = {
    cacheControl: '3600',
    contentType: file.type,
    metadata
  };
  
  // Upload the file
  const { error, data } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, uploadOptions);
    
  return { error, data };
};

/**
 * Gets the public URL of an uploaded file
 */
export const getPublicUrl = (bucketName: string, filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return publicUrl;
};

/**
 * Deletes a file from Supabase storage
 */
export const deleteFile = async (bucketName: string, filePath: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    return { error };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unknown error during file deletion') };
  }
};
