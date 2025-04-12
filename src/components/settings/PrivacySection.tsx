
import React from "react";
import { Shield, CreditCard, Calendar, Bell, Users, Lock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PrivacySectionProps {
  profileVisibility: string;
  setProfileVisibility: React.Dispatch<React.SetStateAction<string>>;
  faceRecPrivacy: string;
  setFaceRecPrivacy: React.Dispatch<React.SetStateAction<string>>;
  handleSaveSettings: (section: string) => void;
  fadeIn: any;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({
  profileVisibility,
  setProfileVisibility,
  faceRecPrivacy,
  setFaceRecPrivacy,
  handleSaveSettings,
  fadeIn
}) => {
  const [paymentVisibility, setPaymentVisibility] = React.useState("private");
  const [appointmentPrivacy, setAppointmentPrivacy] = React.useState("selective");
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [dataSharing, setDataSharing] = React.useState(false);

  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Privacidade</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="profile-visibility">
          <AccordionTrigger className="py-3">Visibilidade do Perfil</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="profile-public" />
                <Label htmlFor="profile-public">Público (Todos podem ver)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="profile-friends" />
                <Label htmlFor="profile-friends">Apenas Amigos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="profile-private" />
                <Label htmlFor="profile-private">Privado (Apenas você)</Label>
              </div>
            </RadioGroup>
            <Button onClick={() => handleSaveSettings("Visibilidade do Perfil")} size="sm" className="mt-3">Salvar</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="face-recognition">
          <AccordionTrigger className="py-3">Privacidade do Reconhecimento Facial</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={faceRecPrivacy} onValueChange={setFaceRecPrivacy} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anyone" id="face-anyone" />
                <Label htmlFor="face-anyone">Todos podem me reconhecer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends-only" id="face-friends" />
                <Label htmlFor="face-friends">Apenas meus contatos podem me reconhecer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disabled" id="face-disabled" />
                <Label htmlFor="face-disabled">Desativar reconhecimento facial</Label>
              </div>
            </RadioGroup>
            <Button onClick={() => handleSaveSettings("Reconhecimento Facial")} size="sm" className="mt-3">Salvar</Button>
          </AccordionContent>
        </AccordionItem>

        {/* New Payment Privacy Section */}
        <AccordionItem value="payment-privacy">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span>Privacidade de Pagamento</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={paymentVisibility} onValueChange={setPaymentVisibility} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="payment-friends" />
                <Label htmlFor="payment-friends">Contatos podem ver meus métodos de pagamento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="payment-private" />
                <Label htmlFor="payment-private">Meus métodos de pagamento são privados</Label>
              </div>
            </RadioGroup>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="save-payment-info">Salvar dados de pagamento</Label>
                <Switch id="save-payment-info" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="payment-notifications">Notificação antes de pagamentos recorrentes</Label>
                <Switch id="payment-notifications" defaultChecked />
              </div>
            </div>
            <Button onClick={() => handleSaveSettings("Privacidade de Pagamento")} size="sm" className="mt-3">Salvar</Button>
          </AccordionContent>
        </AccordionItem>

        {/* New Appointment Privacy Section */}
        <AccordionItem value="appointment-privacy">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Privacidade de Agendamentos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={appointmentPrivacy} onValueChange={setAppointmentPrivacy} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="appointment-public" />
                <Label htmlFor="appointment-public">Horários públicos (todos podem ver)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selective" id="appointment-selective" />
                <Label htmlFor="appointment-selective">Horários visíveis após agendamento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="appointment-private" />
                <Label htmlFor="appointment-private">Horários completamente privados</Label>
              </div>
            </RadioGroup>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-status">Mostrar status (ocupado/disponível)</Label>
                <Switch id="show-status" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-confirm">Confirmação automática de agendamentos</Label>
                <Switch id="auto-confirm" />
              </div>
            </div>
            <Button onClick={() => handleSaveSettings("Privacidade de Agendamentos")} size="sm" className="mt-3">Salvar</Button>
          </AccordionContent>
        </AccordionItem>

        {/* Security Settings */}
        <AccordionItem value="security-settings">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-600" />
              <span>Segurança da Conta</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autenticação de dois fatores</p>
                  <p className="text-sm text-gray-500">Aumente a segurança da sua conta</p>
                </div>
                <Switch 
                  id="two-factor" 
                  checked={twoFactorEnabled} 
                  onCheckedChange={setTwoFactorEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compartilhamento de dados</p>
                  <p className="text-sm text-gray-500">Permitir análise para recomendações</p>
                </div>
                <Switch 
                  id="data-sharing" 
                  checked={dataSharing} 
                  onCheckedChange={setDataSharing} 
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => toast.info("Enviamos um e-mail para redefinir sua senha")}
              >
                Alterar senha
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => toast.info("Acesso recente verificado")}
              >
                Verificar acessos recentes
              </Button>
            </div>
            <Button onClick={() => handleSaveSettings("Segurança da Conta")} size="sm" className="mt-3">Salvar</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.section>
  );
};

export default PrivacySection;
