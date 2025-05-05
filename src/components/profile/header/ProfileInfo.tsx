
import React from "react";
import { motion } from "framer-motion";

interface ProfileInfoProps {
  name: string;
  title: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, title }) => {
  return (
    <div>
      <motion.h1 
        className="text-2xl font-bold text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {name}
      </motion.h1>
      <motion.p 
        className="text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.p>
    </div>
  );
};

export default ProfileInfo;
