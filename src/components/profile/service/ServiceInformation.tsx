
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import ServiceHeader from "./sections/ServiceHeader";
import ServiceTitle from "./sections/ServiceTitle";
import ServicePricing from "./sections/ServicePricing";
import ServiceDuration from "./sections/ServiceDuration";
import ServiceLocation from "./sections/ServiceLocation";
import ServiceGuarantee from "./sections/ServiceGuarantee";
import ServiceRatings from "./sections/ServiceRatings";

interface ServiceInformationProps {
  isOwner?: boolean;
}

const ServiceInformation: React.FC<ServiceInformationProps> = ({ isOwner = false }) => {
  return (
    <Card className="overflow-hidden border-gray-100">
      <CardContent className="p-0">
        <div className="p-4">
          <ServiceHeader />
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-3">
          <ServiceTitle isOwner={isOwner} />
          
          <ServicePricing isOwner={isOwner} />
          
          <ServiceDuration isOwner={isOwner} />
          
          <ServiceLocation isOwner={isOwner} />
          
          <ServiceGuarantee isOwner={isOwner} />
          
          <ServiceRatings />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformation;
