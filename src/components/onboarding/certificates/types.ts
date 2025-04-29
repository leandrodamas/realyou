
export interface Certificate {
  id: string;
  name: string;
  organization: string;
  date: string;
  verified: boolean;
}

export interface NewCertificateData {
  name: string;
  organization: string;
  date: string;
}
