
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Certificate {
  id: string;
  name: string;
  organization: string;
  date: string;
  verified: boolean;
}

interface CertificateItemProps {
  certificate: Certificate;
  onRemove: (id: string) => void;
  onVerify: (id: string) => void;
}

const CertificateItem: React.FC<CertificateItemProps> = ({
  certificate,
  onRemove,
  onVerify
}) => {
  return (
    <motion.div
      key={certificate.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="border rounded-lg p-3 mb-2"
    >
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{certificate.name}</h4>
          <p className="text-sm text-gray-600">
            {certificate.organization} {certificate.date && `• ${certificate.date}`}
          </p>
        </div>
        <div className="flex gap-2">
          {certificate.verified ? (
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Verificado</span>
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onVerify(certificate.id)}
            >
              Verificar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 p-1"
            onClick={() => onRemove(certificate.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateItem;
