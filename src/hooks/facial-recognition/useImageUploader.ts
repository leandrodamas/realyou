
import { useFileUpload } from "../useFileUpload";
import { toast } from "sonner";

export const useImageUploader = () => {
  const { uploadFile } = useFileUpload();

  const uploadProfileImage = async (
    imageData: string, 
    userId: string | undefined, 
    purpose: string
  ) => {
    try {
      console.log(`Starting image upload for purpose: ${purpose}, userId: ${userId || 'anonymous'}`);
      
      // Convert base64 to file
      const base64Response = await fetch(imageData);
      const imageBlob = await base64Response.blob();
      
      // Generate a truly unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}-${randomString}.jpg`;
      
      const imageFile = new File(
        [imageBlob], 
        filename, 
        { type: 'image/jpeg' }
      );
      
      console.log(`Created file object: ${filename}, size: ${imageFile.size} bytes`);
      
      // Simple folder structure to prevent collisions
      const folder = userId 
        ? `${purpose === 'face_registration' ? 'registrations' : 'searches'}/${userId}` 
        : `${purpose === 'face_registration' ? 'registrations' : 'searches'}/anonymous`;
      
      console.log(`Uploading to folder: ${folder}`);
      
      // Set minimal metadata to avoid RLS issues
      const metadata = {
        purpose,
        created_at: new Date().toISOString()
      };
      
      // Upload the image
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName: 'facial_recognition',
        folder,
        metadata,
        // Ensure we're not trying to use auth features for anonymous uploads
        anonymous: !userId
      });
      
      if (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
      
      console.log(`Upload successful, URL: ${publicUrl}`);
      return publicUrl;
      
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Não foi possível fazer upload da imagem");
      return null;
    }
  };

  return { uploadProfileImage };
};
