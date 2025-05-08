
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  fadeIn: any;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ fadeIn }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <motion.div variants={fadeIn}>
      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </motion.div>
  );
};

export default LogoutButton;
