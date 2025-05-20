
import React from "react";
import { Drawer } from "@/components/ui/drawer";
import IntegratedScheduleView from "./IntegratedScheduleView";
import ScheduleSuccessDrawer from "./ScheduleSuccessDrawer";
import ServiceInformation from "../service/ServiceInformation";
import ScheduleServiceControls from "./ScheduleServiceControls";
import { useServiceScheduling } from "./useServiceScheduling";

interface ServiceSchedulingViewProps {
  isOwner?: boolean;
  providerId?: string;
}

/**
 * Main component for the service scheduling view
 * Displays scheduling controls, calendar, time slots, and service information
 */
const ServiceSchedulingView: React.FC<ServiceSchedulingViewProps> = ({ 
  isOwner = true,
  providerId
}) => {
  const {
    showPublicly,
    setShowPublicly,
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    isPromptVisible,
    setIsPromptVisible,
    showMatchSuccess,
    setShowMatchSuccess,
    availableTimeSlots,
    profileData,
    handleScheduleService
  } = useServiceScheduling({ providerId });

  return (
    <div className="space-y-6">
      <ScheduleServiceControls
        isOwner={isOwner}
        showPublicly={showPublicly}
        setShowPublicly={setShowPublicly}
        isPromptVisible={isPromptVisible}
        setIsPromptVisible={setIsPromptVisible}
      />

      <IntegratedScheduleView
        selectedDate={date}
        onDateSelect={setDate}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        onSchedule={handleScheduleService}
        availableTimeSlots={availableTimeSlots}
        profileImage={profileData.profileImage}
        name={profileData.name}
        basePrice={profileData.basePrice}
        providerId={providerId}
      />

      <ServiceInformation isOwner={isOwner} />

      <Drawer open={showMatchSuccess} onOpenChange={setShowMatchSuccess}>
        <ScheduleSuccessDrawer 
          date={date}
          selectedTime={selectedTime}
        />
      </Drawer>
    </div>
  );
};

export default ServiceSchedulingView;
