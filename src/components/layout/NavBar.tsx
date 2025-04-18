
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Search, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const iconVariants = {
    active: { 
      scale: 1.1,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    inactive: { 
      scale: 1,
      y: 0
    }
  };

  const tabVariants = {
    active: {
      color: "#7c3aed",
      transition: { duration: 0.2 }
    },
    inactive: {
      color: "#64748b",
      transition: { duration: 0.2 }
    }
  };

  const indicatorVariants = {
    initial: (active: boolean) => ({
      opacity: active ? 1 : 0,
      y: active ? 0 : 10
    }),
    animate: (active: boolean) => ({
      opacity: active ? 1 : 0,
      y: active ? 0 : 10,
      transition: { duration: 0.3 }
    })
  };

  interface NavItemProps {
    to: string;
    label: string;
    icon: React.ReactNode;
  }

  const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
    const active = isActive(to);
    
    return (
      <Link to={to} className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          <motion.div
            variants={iconVariants}
            initial="inactive"
            animate={active ? "active" : "inactive"}
            className={`p-2 rounded-full`}
          >
            {icon}
          </motion.div>
          
          <motion.span 
            variants={tabVariants}
            initial="inactive"
            animate={active ? "active" : "inactive"}
            className="text-xs mt-0.5 font-medium"
          >
            {label}
          </motion.span>
          
          <motion.div
            custom={active}
            variants={indicatorVariants}
            initial="initial"
            animate="animate"
            className="absolute -bottom-3 h-1 w-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          />
        </div>
      </Link>
    );
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-lg z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex py-3 px-6 items-center">
        <NavItem 
          to="/" 
          label="Home" 
          icon={<Home className={`h-6 w-6 ${isActive("/") ? "text-purple-600" : "text-slate-500"}`} />} 
        />
        
        <NavItem 
          to="/search" 
          label="Search" 
          icon={<Search className={`h-6 w-6 ${isActive("/search") ? "text-purple-600" : "text-slate-500"}`} />} 
        />
        
        <NavItem 
          to="/chats" 
          label="Chats" 
          icon={<MessageCircle className={`h-6 w-6 ${isActive("/chats") ? "text-purple-600" : "text-slate-500"}`} />} 
        />
        
        <NavItem 
          to="/profile" 
          label="Profile" 
          icon={<User className={`h-6 w-6 ${isActive("/profile") ? "text-purple-600" : "text-slate-500"}`} />} 
        />
      </div>
    </motion.div>
  );
};

export default NavBar;
