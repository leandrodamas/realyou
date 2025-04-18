
import React, { useState, useRef } from "react";
import { ArrowLeft, Camera, Check, ChevronRight, CircleUser, Settings, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerFaceForUser } from "@/services/facialRecognitionService";

const FaceRegistrationPage: React.FC = () => {
  const [registrationStep, setRegistrationStep] = useState<number>(1);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Não foi possível acessar sua câmera. Verifique as permissões.");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        setIsCameraActive(false);
        
        toast.success("Imagem capturada com sucesso!");
      }
    } else {
      toast.error("Erro ao capturar imagem. Tente novamente.");
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
  };

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
      // Final step - register the face
      if (capturedImage) {
        setIsProcessing(true);
        try {
          // Generate a temporary user ID - in a real app this would come from your auth system
          const tempUserId = `user_${Date.now()}`;
          const success = await registerFaceForUser(capturedImage, tempUserId);
          
          if (success) {
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
    // Navigate to home page
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        {registrationStep > 1 ? (
          <button 
            onClick={handlePreviousStep} 
            className="rounded-full hover:bg-gray-100 p-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
        ) : (
          <Link to="/" className="rounded-full hover:bg-gray-100 p-2 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
        )}
        <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          RealYou Setup
        </h1>
        <div className="w-9"></div> {/* Empty div for spacing */}
      </header>

      {/* Step indicator */}
      <div className="container max-w-md mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === registrationStep 
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white" 
                    : step < registrationStep 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step < registrationStep ? <Check className="h-4 w-4" /> : step}
              </div>
              <span className="text-xs mt-1 text-gray-500">
                {step === 1 ? "Face" : step === 2 ? "Profile" : "Privacy"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Steps */}
      <div className="container max-w-md mx-auto px-4 pb-24">
        {registrationStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Add Your Face</h2>
              <p className="text-gray-600 mb-6">
                Your face is your unique identifier on RealYou. Be yourself, be genuine.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
                {isCameraActive ? (
                  <div className="aspect-square w-full relative">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-white opacity-40 rounded-xl flex items-center justify-center">
                      <div className="border-4 border-dotted border-white w-2/3 h-2/3 rounded-full opacity-60"></div>
                    </div>
                    <div className="absolute bottom-4 w-full flex justify-center">
                      <Button 
                        onClick={handleCapture} 
                        className="rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100"
                      >
                        <Camera className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <div className="aspect-square w-full relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured face" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="rounded-full shadow-md"
                        onClick={handleReset}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square w-full flex flex-col items-center justify-center p-6">
                    <CircleUser className="h-24 w-24 text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-6">Take a clear picture of your face</p>
                    <Button 
                      onClick={handleStartCamera} 
                      className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md"
                    >
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6 px-8">
              Your facial data is stored securely and only used to help friends recognize you
            </p>
          </motion.div>
        )}

        {registrationStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Create Your Profile</h2>
              <p className="text-gray-600 mb-6">
                Tell us a bit about yourself so others can recognize you
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-8 flex items-center justify-center">
                {capturedImage && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100">
                    <img 
                      src={capturedImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {registrationStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Privacy Settings</h2>
              <p className="text-gray-600 mb-6">
                Control who can find you using face recognition
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Allow Friends to Find Me</h3>
                    <p className="text-sm text-gray-500">People you know can find you by your face</p>
                  </div>
                  <div className="form-control">
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Allow Friend Requests by Face</h3>
                    <p className="text-sm text-gray-500">Let others send you requests by scanning your face</p>
                  </div>
                  <div className="form-control">
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Advanced Privacy</h3>
                    <p className="text-sm text-gray-500">More control over your facial data</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                You can change these settings anytime from your profile
              </p>
            </div>
          </motion.div>
        )}

        {/* Continue button */}
        <div className="mt-8">
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

      {/* Hidden canvas for capturing images */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome to RealYou!</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Your face has been successfully registered
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-center text-gray-600 mb-6">
              You're all set! Start connecting with friends using face recognition.
            </p>
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
              onClick={handleFinishRegistration}
            >
              Start Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaceRegistrationPage;
