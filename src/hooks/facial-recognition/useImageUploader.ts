
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
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
      
      const imageFile = new File(
        [imageBlob], 
        filename, 
        { type: 'image/jpeg' }
      );
      
      console.log(`Created file object: ${filename}, size: ${imageFile.size} bytes`);
      
      // Determine folder based on purpose
      const folder = userId 
        ? `${purpose === 'face_registration' ? 'registrations' : 'searches'}/${userId}` 
        : `${purpose === 'face_registration' ? 'registrations' : 'searches'}/anonymous`;
      
      console.log(`Uploading to folder: ${folder}`);
      
      // Upload the image
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName: 'facial_recognition',
        folder,
        metadata: {
          purpose,
          userId: userId || 'anonymous'
        }
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
