
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

const ServiceInformation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ServiceHeader />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ServiceTitle />
          <Separator />
          <ServiceDuration />
          <Separator />
          <ServicePricing />
          <Separator />
          <ServiceLocation />
          <Separator />
          <ServiceRatings />
          <ServiceGuarantee />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformation;
