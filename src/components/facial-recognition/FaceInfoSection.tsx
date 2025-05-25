
import React from "react";
import { motion } from "framer-motion";
import FaceTechnologyInfo from "./FaceTechnologyInfo";
import FaceSecurityPrivacy from "./FaceSecurityPrivacy";

interface FaceInfoSectionProps {
  showInfo: boolean;
}

const FaceInfoSection: React.FC<FaceInfoSectionProps> = ({ showInfo }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: showInfo ? "auto" : 0, opacity: showInfo ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden mb-4"
    >
      <div className="space-y-4 mb-4">
        <FaceTechnologyInfo />
        <FaceSecurityPrivacy />
      </div>
    </motion.div>
  );
};

export default FaceInfoSection;
