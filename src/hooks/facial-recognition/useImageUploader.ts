
import { useFileUpload } from "../useFileUpload";

export const useImageUploader = () => {
  const { uploadFile } = useFileUpload();

  const uploadProfileImage = async (
    imageData: string, 
    userId: string | undefined, 
    purpose: string
  ) => {
    // Convert base64 to file
    const imageBlob = await fetch(imageData).then(r => r.blob());
    const imageFile = new File(
      [imageBlob], 
      `${purpose}-${Date.now()}.jpg`, 
      { type: 'image/jpeg' }
    );
    
    // Determine folder based on purpose
    const folder = purpose === 'face_registration' 
      ? `registrations/${userId}` 
      : `searches/${userId}`;
    
    // Upload the image
    const { publicUrl } = await uploadFile(imageFile, {
      bucketName: 'facial_recognition',
      folder,
      metadata: {
        user_id: userId || 'anonymous',
        purpose
      }
    });
    
    return publicUrl;
  };

  return { uploadProfileImage };
};
