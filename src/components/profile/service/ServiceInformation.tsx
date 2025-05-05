
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ServiceHeader from "./sections/ServiceHeader";
import ServiceTitle from "./sections/ServiceTitle";
import ServiceDuration from "./sections/ServiceDuration";
import ServicePricing from "./sections/ServicePricing";
import ServiceLocation from "./sections/ServiceLocation";
import ServiceRatings from "./sections/ServiceRatings";
import ServiceGuarantee from "./sections/ServiceGuarantee";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";

interface ServiceInformationProps {
  isOwner?: boolean;
}

const ServiceInformation: React.FC<ServiceInformationProps> = ({ isOwner = true }) => {
  const { getProfile } = useProfileStorage();
  const profile = getProfile() || {};
  
  // Serviço padrão caso o usuário ainda não tenha configurado
  const serviceName = profile.serviceName || "Consultoria de Software";
  const serviceRating = profile.serviceRating || 4.9;
  const serviceDuration = profile.serviceDuration || "1 hora";
  const serviceLocation = profile.serviceLocation || "Online (via chamada de vídeo)";
  const serviceDescription = profile.serviceDescription || 
    "Consultoria personalizada para desenvolvimento de software, arquitetura de sistemas e resolução de problemas técnicos.";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ServiceHeader rating={serviceRating} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ServiceTitle title={serviceName} isOwner={isOwner} />
          <Separator />
          <ServiceDuration duration={serviceDuration} isOwner={isOwner} />
          <Separator />
          <ServicePricing isOwner={isOwner} />
          <Separator />
          <ServiceLocation location={serviceLocation} isOwner={isOwner} />
          <Separator />
          <ServiceRatings isOwner={isOwner} />
          <ServiceGuarantee description={serviceDescription} isOwner={isOwner} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformation;
