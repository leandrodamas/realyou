
import React from "react";
import ServiceSchedulingView from "./schedule/ServiceSchedulingView";

interface ServiceSchedulingSectionProps {
  isOwner?: boolean;
  providerId?: string;
}

/**
 * Container component for the service scheduling functionality
 * This component acts as an entry point to the scheduling feature
 */
const ServiceSchedulingSection: React.FC<ServiceSchedulingSectionProps> = ({ 
  isOwner = true,
  providerId
}) => {
  return (
    <ServiceSchedulingView 
      isOwner={isOwner}
      providerId={providerId}
    />
  );
};

export default ServiceSchedulingSection;
