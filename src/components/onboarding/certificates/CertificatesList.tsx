
import React from "react";
import { AnimatePresence } from "framer-motion";
import CertificateItem from "./CertificateItem";

interface Certificate {
  id: string;
  name: string;
  organization: string;
  date: string;
  verified: boolean;
}

interface CertificatesListProps {
  certificates: Certificate[];
  onRemoveCertificate: (id: string) => void;
  onVerifyCertificate: (id: string) => void;
}

const CertificatesList: React.FC<CertificatesListProps> = ({
  certificates,
  onRemoveCertificate,
  onVerifyCertificate
}) => {
  if (certificates.length === 0) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {certificates.map((cert) => (
        <CertificateItem
          key={cert.id}
          certificate={cert}
          onRemove={onRemoveCertificate}
          onVerify={onVerifyCertificate}
        />
      ))}
    </AnimatePresence>
  );
};

export default CertificatesList;
