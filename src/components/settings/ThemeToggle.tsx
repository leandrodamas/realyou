
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  fadeIn: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, setDarkMode, fadeIn }) => {
  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {darkMode ? 
            <Moon className="h-5 w-5 text-indigo-600" /> :
            <Sun className="h-5 w-5 text-amber-500" />
          }
          <h2 className="text-lg font-semibold">Theme</h2>
        </div>
        <Switch 
          checked={darkMode}
          onCheckedChange={() => {
            setDarkMode(!darkMode);
            toast.success(`Switched to ${!darkMode ? 'dark' : 'light'} mode`);
          }}
        />
      </div>
    </motion.section>
  );
};

export default ThemeToggle;
