
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Certificate, NewCertificateData } from "./certificates/types";
import CertificationsInfoBox from "./certificates/CertificationsInfoBox";
import CertificatesList from "./certificates/CertificatesList";
import AddCertificateButton from "./certificates/AddCertificateButton";
import CertificateForm from "./certificates/CertificateForm";

interface CertificationsFormProps {
  onComplete: () => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ onComplete }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCertificate, setNewCertificate] = useState<NewCertificateData>({
    name: '',
    organization: '',
    date: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setNewCertificate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCertificate = () => {
    if (!newCertificate.name || !newCertificate.organization) {
      toast.error("Nome e organização são campos obrigatórios");
      return;
    }

    const certificate: Certificate = {
      id: Math.random().toString(36).substring(2, 11),
      ...newCertificate,
      verified: false
    };

    setCertificates([...certificates, certificate]);
    setNewCertificate({
      name: '',
      organization: '',
      date: '',
    });
    setIsAdding(false);
    toast.success("Certificado adicionado com sucesso!");
  };

  const removeCertificate = (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    toast.info("Certificado removido");
  };

  const verifyCertificate = (id: string) => {
    setCertificates(certificates.map(cert => {
      if (cert.id === id) {
        return { ...cert, verified: true };
      }
      return cert;
    }));
    toast.success("Certificado verificado com sucesso!");
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Certificações</h3>
      
      <CertificationsInfoBox />
      
      <CertificatesList 
        certificates={certificates} 
        onRemoveCertificate={removeCertificate} 
        onVerifyCertificate={verifyCertificate} 
      />
      
      {isAdding ? (
        <CertificateForm 
          certificateData={newCertificate}
          onChange={handleInputChange}
          onAddCertificate={addCertificate}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <AddCertificateButton onClick={() => setIsAdding(true)} />
      )}
      
      <div className="pt-4">
        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700"
          onClick={onComplete}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CertificationsForm;
