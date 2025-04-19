
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ProfileImageUpload from "@/components/onboarding/ProfileImageUpload";

interface FaceRegistrationProps {
  onImageCaptured: (imageData: string) => void;
  defaultImage?: string | null;
}

const FaceRegistration: React.FC<FaceRegistrationProps> = ({
  onImageCaptured,
  defaultImage = null
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(defaultImage);
  
  const handleImageChange = (imageData: string) => {
    setProfileImage(imageData);
    onImageCaptured(imageData);
  };
  
  // Initial state - prompt to upload/take photo
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg min-h-[300px]">
      {profileImage ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button 
            variant="outline"
            onClick={() => setProfileImage(null)}
            className="text-sm"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Escolher outra foto
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex justify-center text-gray-400 mb-4">
              <Camera size={48} />
            </div>
            <h3 className="text-lg font-medium mb-2">Foto de Perfil</h3>
            <p className="text-gray-500 text-center mb-4">
              Adicione uma foto clara para seu perfil
            </p>
          </div>
          
          <ProfileImageUpload 
            profileImage={profileImage}
            fullName=""
            onChange={handleImageChange}
          />
        </div>
      )}
    </div>
  );
};

export default FaceRegistration;
