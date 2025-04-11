
import React from "react";
import { Shield, Eye, Bell, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface QuickSettingsSectionProps {
  openSettings: (section?: string) => void;
}

const QuickSettingsSection: React.FC<QuickSettingsSectionProps> = ({ openSettings }) => {
  return (
    <motion.div 
      className="mx-4 my-3 p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-600">Quick Settings</h3>
        <Link to="/settings" className="text-xs text-purple-600 font-medium">All Settings</Link>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-3">
        <Link to="/settings" onClick={() => openSettings("profile-visibility")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="w-9 h-9 flex items-center justify-center bg-purple-100 rounded-full">
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          <span className="text-xs mt-1 text-center">Privacy</span>
        </Link>
        
        <Link to="/settings" onClick={() => openSettings("story-visibility")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-full">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-xs mt-1 text-center">Stories</span>
        </Link>
        
        <Link to="/settings" onClick={() => openSettings("notifications")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="w-9 h-9 flex items-center justify-center bg-orange-100 rounded-full">
            <Bell className="h-4 w-4 text-orange-600" />
          </div>
          <span className="text-xs mt-1 text-center">Alerts</span>
        </Link>
        
        <Link to="/settings" onClick={() => openSettings("achievements")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-full">
            <Trophy className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-xs mt-1 text-center">Badges</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default QuickSettingsSection;
