
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-20 bg-gray-100 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
