
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { registerFaceForUser } from "@/services/facialRecognitionService";
import HeaderComponent from "@/components/face-registration/HeaderComponent";
import StepIndicator from "@/components/face-registration/StepIndicator";
import StepContent from "@/components/face-registration/StepContent";
import SuccessDialog from "@/components/face-registration/SuccessDialog";
import { useNavigate } from "react-router-dom";
import { useFacialRecognition } from "@/hooks/useFacialRecognition";

const FaceRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [registrationStep, setRegistrationStep] = useState<number>(1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { registerFace } = useFacialRecognition();

  // Load any existing profile data when component mounts
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.username) {
          setUsername(profile.username);
        }
        if (profile.profileImage) {
          setCapturedImage(profile.profileImage);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil existente:", error);
    }
  }, []);

  const handleNextStep = async () => {
    if (registrationStep === 1 && !capturedImage) {
      toast.error("Captura de rosto obrigatória para continuar");
      return;
    }
    
    if (registrationStep === 2 && !username.trim()) {
      toast.error("Nome de usuário obrigatório para continuar");
      return;
    }
    
    if (registrationStep < 3) {
      setRegistrationStep(registrationStep + 1);
    } else {
      if (capturedImage) {
        setIsProcessing(true);
        try {
          const tempUserId = `user_${Date.now()}`;
          // Usar o hook de reconhecimento facial para registrar
          const success = await registerFace(capturedImage, tempUserId);
          
          if (success) {
            // Salvar ou atualizar informações do usuário no localStorage
            const savedProfile = localStorage.getItem('userProfile');
            const existingProfile = savedProfile ? JSON.parse(savedProfile) : {};
            
            const updatedProfile = {
              ...existingProfile,
              userId: tempUserId,
              username: username,
              fullName: username, // Save username as fullName too for consistent data
              profileImage: capturedImage,
              registrationComplete: true,
              registrationDate: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            
            // Sincronizar perfil com outras partes do aplicativo
            document.dispatchEvent(new CustomEvent('profileUpdated', { 
              detail: { 
                profile: updatedProfile 
              }
            }));
            
            setShowSuccessDialog(true);
          } else {
            toast.error("Falha ao registrar rosto. Tente novamente.");
          }
        } catch (error) {
          console.error("Error registering face:", error);
          toast.error("Ocorreu um erro ao registrar seu rosto");
        } finally {
          setIsProcessing(false);
        }
      } else {
        toast.error("Imagem do rosto não disponível");
      }
    }
  };

  const handlePreviousStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    }
  };

  const handleFinishRegistration = () => {
    setShowSuccessDialog(false);
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <HeaderComponent />
      <StepIndicator currentStep={registrationStep} />

      <div className="container max-w-md mx-auto px-4 pb-24">
        <StepContent
          step={registrationStep}
          username={username}
          setUsername={setUsername}
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
        />

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {registrationStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              className="w-full rounded-xl border-gray-300"
            >
              Voltar
            </Button>
          )}
          
          <Button 
            onClick={handleNextStep}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md py-6"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Processando...
              </div>
            ) : registrationStep < 3 ? "Continue" : "Complete Setup"}
          </Button>
        </div>
      </div>

      <SuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onFinish={handleFinishRegistration}
      />
    </div>
  );
};

export default FaceRegistrationPage;
