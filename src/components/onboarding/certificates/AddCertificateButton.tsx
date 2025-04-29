
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddCertificateButtonProps {
  onClick: () => void;
}

const AddCertificateButton: React.FC<AddCertificateButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center"
      onClick={onClick}
    >
      <Plus className="h-4 w-4 mr-2" />
      Adicionar Certificado
    </Button>
  );
};

export default AddCertificateButton;
