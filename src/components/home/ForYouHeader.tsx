
import React from "react";
import { motion } from "framer-motion";

const ForYouHeader: React.FC = () => {
  return (
    <div className="px-4 mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">For You</h2>
      <button className="text-sm font-medium text-purple-600">See All</button>
    </div>
  );
};

export default ForYouHeader;
