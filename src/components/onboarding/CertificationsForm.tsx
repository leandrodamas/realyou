
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Award, Upload, CheckCircle, Calendar, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CertificationsFormProps {
  onComplete: () => void;
}

interface Certificate {
  id: string;
  name: string;
  organization: string;
  date: string;
  verified: boolean;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ onComplete }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id' | 'verified'>>({
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
      
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
        <div className="flex items-center mb-2">
          <Award className="h-5 w-5 text-amber-600 mr-2" />
          <span className="font-medium">Destaque suas credenciais!</span>
        </div>
        <p className="text-sm text-gray-600">
          Adicione suas certificações profissionais e cursos para comprovar suas habilidades.
          Certificações verificadas aumentam em 70% as chances de conversão.
        </p>
      </div>
      
      <AnimatePresence>
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-3 mb-2"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{cert.name}</h4>
                <p className="text-sm text-gray-600">
                  {cert.organization} {cert.date && `• ${cert.date}`}
                </p>
              </div>
              <div className="flex gap-2">
                {cert.verified ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Verificado</span>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => verifyCertificate(cert.id)}
                  >
                    Verificar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 p-1"
                  onClick={() => removeCertificate(cert.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isAdding ? (
        <div className="border rounded-lg p-3">
          <h4 className="font-medium mb-2">Novo Certificado</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nome do certificado *
              </label>
              <Input
                placeholder="Ex: Design UX/UI"
                value={newCertificate.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Instituição/Organização *
              </label>
              <Input
                placeholder="Ex: Universidade XYZ"
                value={newCertificate.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Data de conclusão
              </label>
              <Input
                placeholder="Ex: Agosto 2023"
                value={newCertificate.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline"
                onClick={() => setIsAdding(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={addCertificate}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Certificado
        </Button>
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
