
import React from "react";

const MapControls: React.FC = () => {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2">
      <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
      </button>
      <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
        </svg>
      </button>
    </div>
  );
};

export default MapControls;
