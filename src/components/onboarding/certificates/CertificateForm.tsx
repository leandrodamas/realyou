
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewCertificateData {
  name: string;
  organization: string;
  date: string;
}

interface CertificateFormProps {
  certificateData: NewCertificateData;
  onChange: (field: string, value: string) => void;
  onAddCertificate: () => void;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  certificateData,
  onChange,
  onAddCertificate,
  onCancel
}) => {
  return (
    <div className="border rounded-lg p-3">
      <h4 className="font-medium mb-2">Novo Certificado</h4>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Nome do certificado *
          </label>
          <Input
            placeholder="Ex: Design UX/UI"
            value={certificateData.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">
            Instituição/Organização *
          </label>
          <Input
            placeholder="Ex: Universidade XYZ"
            value={certificateData.organization}
            onChange={(e) => onChange('organization', e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">
            Data de conclusão
          </label>
          <Input
            placeholder="Ex: Agosto 2023"
            value={certificateData.date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onAddCertificate}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateForm;
