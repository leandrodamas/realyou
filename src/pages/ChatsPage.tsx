
import React, { useState } from "react";
import ChatList from "@/components/chats/ChatList";
import { Button } from "@/components/ui/button";
import { Search, Edit, Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const ChatsPage: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [callWith, setCallWith] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const startCall = (name: string) => {
    setCallWith(name);
    setInCall(true);
    toast.success(`Chamada de vídeo iniciada com ${name}`);
  };

  const endCall = () => {
    toast.info(`Chamada encerrada com ${callWith}`);
    setInCall(false);
    setCallWith("");
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast(`Vídeo ${!videoEnabled ? 'ativado' : 'desativado'}`);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast(`Microfone ${!audioEnabled ? 'ativado' : 'desativado'}`);
  };

  // Simula uma chamada recebida após 5 segundos quando a página é carregada
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!inCall) {
        startCall("Maria Silva");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
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
        <ChatList />
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
    </div>
  );
};

export default ChatsPage;
