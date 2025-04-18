
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, onOpenChange, onFinish }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to RealYou!</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Your face has been successfully registered
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <p className="text-center text-gray-600 mb-6">
            You're all set! Start connecting with friends using face recognition.
          </p>
          <Button 
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
            onClick={onFinish}
          >
            Start Exploring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
