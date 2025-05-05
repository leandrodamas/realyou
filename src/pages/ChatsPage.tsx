import React, { useState, useRef } from "react";
import ChatList from "@/components/chats/ChatList";
import { Button } from "@/components/ui/button";
import { Search, Edit, Video, VideoOff, Mic, MicOff, PhoneOff, Image, Paperclip, Send, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const ChatsPage: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [callWith, setCallWith] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [message, setMessage] = useState("");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start video call
  const startCall = (name: string) => {
    setCallWith(name);
    setInCall(true);
    toast.success(`Chamada de vídeo iniciada com ${name}`);
  };

  // End video call
  const endCall = () => {
    toast.info(`Chamada encerrada com ${callWith}`);
    setInCall(false);
    setCallWith("");
  };

  // Toggle video in call
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast(`Vídeo ${!videoEnabled ? 'ativado' : 'desativado'}`);
  };

  // Toggle audio in call
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast(`Microfone ${!audioEnabled ? 'ativado' : 'desativado'}`);
  };

  // Open chat with user
  const openChat = (id: number, name: string) => {
    setSelectedChat(id);
    setChatOpen(true);
    // We'll use the name from the selected chat in the list
    setCallWith(name);
  };

  // Send text message
  const sendMessage = () => {
    if (message.trim()) {
      toast.success(`Mensagem enviada para ${callWith}`);
      setMessage("");
    }
  };

  // Start recording audio message
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.start();
      setIsRecordingAudio(true);
      
      // Start timer
      setAudioTime(0);
      audioTimerRef.current = setInterval(() => {
        setAudioTime(prev => prev + 1);
      }, 1000);
      
      toast("Gravando mensagem de voz...");
    } catch (error) {
      toast.error("Erro ao acessar microfone");
      console.error("Error accessing microphone:", error);
    }
  };
  
  // Stop recording audio message
  const stopAudioRecording = () => {
    if (audioRecorderRef.current && isRecordingAudio) {
      audioRecorderRef.current.stop();
      
      audioRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Here you would typically send the audio blob to your backend
        // For demo purposes, we'll just show a toast
        toast.success(`Mensagem de voz de ${audioTime}s enviada para ${callWith}`);
      };
      
      // Stop all tracks in the stream
      audioRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      
      // Clear timer
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
      }
      
      setIsRecordingAudio(false);
      setAudioTime(0);
    }
  };

  // Handle attachment selection
  const handleAttachment = (type: string) => {
    setAttachmentType(type);
    
    // For demo purposes, we'll just show a toast
    toast.success(`Seleção de ${type} aberta`);
    
    // In a real app, here you would open a file picker or camera
    // For demo, we'll just simulate it closing after a second
    setTimeout(() => {
      setAttachmentType(null);
      toast(`${type} enviado para ${callWith}`);
    }, 1000);
  };

  // Send location
  const shareLocation = () => {
    if (navigator.geolocation) {
      toast("Obtendo sua localização...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast.success(`Localização enviada para ${callWith}: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          toast.error("Erro ao obter localização");
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast.error("Geolocalização não suportada pelo seu navegador");
    }
  };

  // Simulate a call after 5 seconds when the page is loaded
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!inCall && !chatOpen) {
        startCall("Maria Silva");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold">Chats</h1>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Edit className="h-5 w-5" />
          </Button>
        </header>

        {/* Search */}
        <div className="p-4 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              className="bg-gray-100 pl-10 rounded-full"
              placeholder="Search"
              type="search"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-white">
          <ChatList onChatSelect={(id, name) => openChat(id, name)} />
        </div>

        {/* Video Call Dialog */}
        <Dialog open={inCall} onOpenChange={(open) => !open && endCall()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chamada de vídeo com {callWith}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="bg-gray-900 w-full h-64 rounded-lg flex items-center justify-center mb-4">
                {videoEnabled ? (
                  <video 
                    className="w-full h-full object-cover rounded-lg"
                    autoPlay
                    muted
                    loop
                    src="https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-a-modern-kitchen-speaking-through-a-video-call-755-large.mp4"
                  />
                ) : (
                  <div className="text-white text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2" />
                    <p>Vídeo desativado</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVideo}
                  className={videoEnabled ? "bg-white" : "bg-gray-200"}
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudio}
                  className={audioEnabled ? "bg-white" : "bg-gray-200"}
                >
                  {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endCall}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Chat Sheet */}
        <Sheet open={chatOpen} onOpenChange={(open) => setChatOpen(open)}>
          <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
            <SheetHeader className="border-b p-4 bg-white sticky top-0 z-10">
              <SheetTitle className="text-left flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={() => startCall(callWith)}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <span>{callWith}</span>
              </SheetTitle>
            </SheetHeader>
            
            {/* Chat messages area - Would be filled with actual messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                  <p>Olá, como vai?</p>
                  <span className="text-xs text-gray-500">10:30 AM</span>
                </div>
                
                <div className="bg-blue-100 p-3 rounded-lg max-w-[80%] ml-auto">
                  <p>Estou bem! E você?</p>
                  <span className="text-xs text-gray-500">10:31 AM</span>
                </div>
                
                <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                  <p>Podemos marcar uma reunião amanhã?</p>
                  <span className="text-xs text-gray-500">10:32 AM</span>
                </div>
                
                <div className="bg-blue-100 p-3 rounded-lg max-w-[80%] ml-auto">
                  <p>Claro! Que horas é melhor para você?</p>
                  <span className="text-xs text-gray-500">10:33 AM</span>
                </div>
              </div>
            </div>
            
            {/* Message input area */}
            <div className="border-t p-3 bg-white sticky bottom-0">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleAttachment('arquivo')}
                  className="text-gray-500"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleAttachment('mídia')}
                  className="text-gray-500"
                >
                  <Image className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={shareLocation}
                  className="text-gray-500"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                
                <Input
                  className="flex-1"
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                
                {message ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={sendMessage}
                    className="text-blue-500"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-500"
                    onMouseDown={startAudioRecording}
                    onMouseUp={stopAudioRecording}
                    onTouchStart={startAudioRecording}
                    onTouchEnd={stopAudioRecording}
                  >
                    <Mic className={`h-5 w-5 ${isRecordingAudio ? "text-red-500 animate-pulse" : ""}`} />
                    {isRecordingAudio && <span className="absolute -top-8 bg-gray-800 text-white px-2 py-1 rounded text-xs">{audioTime}s</span>}
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ProtectedRoute>
  );
};

export default ChatsPage;
