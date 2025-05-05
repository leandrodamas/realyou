
import React, { useState } from "react";
import { 
  LayoutDashboard, Calendar, User, Settings, Award, Star, 
  CheckCircle, ArrowRight, Camera, Image, MapPin, Clock, Shield,
  BadgeCheck, Users, CreditCard, Zap, CheckCheck, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingSection, OnboardingItem } from "./OnboardingSection";
import OnboardingProgress from "./OnboardingProgress";
import PersonalInfoForm from "./PersonalInfoForm";
import LocationForm from "./LocationForm";
import PricingForm from "./PricingForm";
import GalleryForm from "./GalleryForm";
import SocialMediaForm from "./SocialMediaForm";
import CertificationsForm from "./CertificationsForm";
import AvailabilityForm from "./AvailabilityForm";
import { useNavigate } from "react-router-dom";

const GamifiedOnboarding: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Calculate progress based on completed sections
  const totalSections = 7; // Total number of sections that can be completed
  const progress = Math.round((completedSections.length / totalSections) * 100);
  
  // Points calculation
  const pointsPerSection = 10;
  const pointsEarned = completedSections.length * pointsPerSection;
  const totalPoints = totalSections * pointsPerSection;

  const handleSectionClick = (section: string) => {
    setActiveSection(section === activeSection ? null : section);
  };

  const completeSection = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
    setActiveSection(null);
  };
  
  const navigateToProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <OnboardingProgress 
        progress={progress} 
        pointsEarned={pointsEarned} 
        totalPoints={totalPoints} 
      />

      <OnboardingSection title="Informações Essenciais">
        <OnboardingItem
          title="Informações Pessoais"
          description="Nome, foto e título profissional"
          icon={User}
          isActive={activeSection === "personal"}
          isCompleted={completedSections.includes("personal")}
          onClick={() => handleSectionClick("personal")}
        />

        {activeSection === "personal" && (
          <PersonalInfoForm onComplete={() => completeSection("personal")} />
        )}
        
        <OnboardingItem
          title="Localização"
          description="Onde você oferece seus serviços"
          icon={MapPin}
          isActive={activeSection === "location"}
          isCompleted={completedSections.includes("location")}
          onClick={() => handleSectionClick("location")}
        />
        
        {activeSection === "location" && (
          <LocationForm onComplete={() => completeSection("location")} />
        )}
        
        <OnboardingItem
          title="Precificação"
          description="Defina seus valores e pacotes"
          icon={DollarSign}
          isActive={activeSection === "pricing"}
          isCompleted={completedSections.includes("pricing")}
          onClick={() => handleSectionClick("pricing")}
        />
        
        {activeSection === "pricing" && (
          <PricingForm onComplete={() => completeSection("pricing")} />
        )}
      </OnboardingSection>

      <OnboardingSection title="Reforço de Perfil (+ pontos)">
        <OnboardingItem
          title="Galeria de Trabalhos"
          description="Adicione fotos dos seus melhores trabalhos"
          icon={Image}
          isActive={activeSection === "gallery"}
          isCompleted={completedSections.includes("gallery")}
          onClick={() => handleSectionClick("gallery")}
        />
        
        {activeSection === "gallery" && (
          <GalleryForm onComplete={() => completeSection("gallery")} />
        )}
        
        <OnboardingItem
          title="Conectar Redes Sociais"
          description="LinkedIn, Instagram, ou portfólio"
          icon={Users}
          isActive={activeSection === "social"}
          isCompleted={completedSections.includes("social")}
          onClick={() => handleSectionClick("social")}
        />
        
        {activeSection === "social" && (
          <SocialMediaForm onComplete={() => completeSection("social")} />
        )}
        
        <OnboardingItem
          title="Certificações"
          description="Adicione suas credenciais e formação"
          icon={Award}
          isActive={activeSection === "certificates"}
          isCompleted={completedSections.includes("certificates")}
          onClick={() => handleSectionClick("certificates")}
        />
        
        {activeSection === "certificates" && (
          <CertificationsForm onComplete={() => completeSection("certificates")} />
        )}
        
        <OnboardingItem
          title="Disponibilidade"
          description="Configure sua agenda e horários"
          icon={Calendar}
          isActive={activeSection === "availability"}
          isCompleted={completedSections.includes("availability")}
          onClick={() => handleSectionClick("availability")}
        />
        
        {activeSection === "availability" && (
          <AvailabilityForm onComplete={() => completeSection("availability")} />
        )}
      </OnboardingSection>

      {progress === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
            <CheckCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-green-800">Perfil Completo!</h3>
          <p className="text-sm text-green-600 mb-3">
            Parabéns! Seu perfil está 100% completo e pronto para atrair clientes.
          </p>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={navigateToProfile}
          >
            Ver Meu Perfil
          </Button>
        </div>
      )}
    </div>
  );
};

export default GamifiedOnboarding;
