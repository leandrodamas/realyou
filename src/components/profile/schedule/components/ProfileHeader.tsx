
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileHeaderProps {
  profileImage: string;
  name: string;
  basePrice: number;
  isDynamicPrice: boolean;
  finalPrice: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImage,
  name,
  basePrice,
  isDynamicPrice,
  finalPrice
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="md:col-span-3">
      <CardContent className={`p-${isMobile ? '3' : '4'}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <img
              src={profileImage}
              alt={name}
              className={`${isMobile ? 'h-14 w-14' : 'h-16 w-16'} rounded-full object-cover border-2 border-purple-200`}
              loading="eager" // Ensure faster loading on mobile
            />
          </div>
          <div>
            <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>{name}</h3>
            <div className="text-sm text-gray-500">Consultor(a) Profissional</div>
            <div className="mt-1 flex items-center">
              <span className="font-semibold">R$ {finalPrice},00</span>
              {isDynamicPrice && (
                <span className={`ml-2 text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                  Alta demanda (+20%)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
