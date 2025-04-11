
import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface LocationSectionProps {
  location: string;
}

const LocationSection: React.FC<LocationSectionProps> = ({ location }) => {
  return (
    <motion.div 
      className="flex items-center"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-blue-100 p-2 rounded-full mr-3">
        <MapPin className="h-5 w-5 text-blue-600" />
      </div>
      <p className="text-sm">{location}</p>
    </motion.div>
  );
};

export default LocationSection;
