
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketingPromptProps {
  isPromptVisible: boolean;
  onDismiss: () => void;
}

const MarketingPrompt: React.FC<MarketingPromptProps> = ({
  isPromptVisible,
  onDismiss,
}) => {
  if (!isPromptVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Aumente sua visibilidade
                </h3>
                <p className="text-sm opacity-90">
                  Profissionais com preços alinhados ao mercado conseguem 40% mais clientes
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 -mt-2 -mr-2"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarketingPrompt;
