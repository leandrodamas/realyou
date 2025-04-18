
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LogoutButtonProps {
  fadeIn: any;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ fadeIn }) => {
  return (
    <motion.div variants={fadeIn}>
      <Button variant="destructive" className="w-full" onClick={() => toast.info("Logged out successfully")}>
        <LogOut className="h-4 w-4 mr-2" />
        Log Out
      </Button>
    </motion.div>
  );
};

export default LogoutButton;
