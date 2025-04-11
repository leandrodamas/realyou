
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";

interface NotificationsSectionProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveSettings: (section: string) => void;
  fadeIn: any;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notificationsEnabled,
  setNotificationsEnabled,
  handleSaveSettings,
  fadeIn
}) => {
  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">Enable All Notifications</span>
        <Switch 
          id="enable-notifications"
          checked={notificationsEnabled}
          onCheckedChange={setNotificationsEnabled}
        />
      </div>

      {notificationsEnabled && (
        <div className="space-y-4">
          <ToggleGroup type="multiple" className="justify-start flex-wrap gap-2">
            <ToggleGroupItem value="messages">Messages</ToggleGroupItem>
            <ToggleGroupItem value="mentions">Mentions</ToggleGroupItem>
            <ToggleGroupItem value="friend-requests">Friend Requests</ToggleGroupItem>
            <ToggleGroupItem value="comments">Comments</ToggleGroupItem>
            <ToggleGroupItem value="likes">Likes</ToggleGroupItem>
          </ToggleGroup>
          
          <Button onClick={() => handleSaveSettings("Notifications")} size="sm">Save Preferences</Button>
        </div>
      )}
    </motion.section>
  );
};

export default NotificationsSection;
