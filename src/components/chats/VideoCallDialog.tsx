
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { toast } from "sonner";

interface VideoCallDialogProps {
  inCall: boolean;
  callWith: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  onEndCall: () => void;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
}

const VideoCallDialog: React.FC<VideoCallDialogProps> = ({
  inCall,
  callWith,
  videoEnabled,
  audioEnabled,
  onEndCall,
  onVideoToggle,
  onAudioToggle,
}) => {
  return (
    <Dialog open={inCall} onOpenChange={(open) => !open && onEndCall()}>
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
              onClick={onVideoToggle}
              className={videoEnabled ? "bg-white" : "bg-gray-200"}
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onAudioToggle}
              className={audioEnabled ? "bg-white" : "bg-gray-200"}
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button variant="destructive" size="icon" onClick={onEndCall}>
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallDialog;
