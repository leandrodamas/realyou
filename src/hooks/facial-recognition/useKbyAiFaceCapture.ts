import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

// Definir tipos para o estado e retorno do hook
interface KbyAiFaceCaptureState {
  isLoading: boolean;
  isInitializing: boolean;
  isCameraActive: boolean;
  isDetecting: boolean;
  feedbackMessage: string | null;
  capturedImage: string | null;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  // Adicionar mais funções conforme necessário (ex: getBestImage)
}

// Declarar as funções do SDK que esperamos que estejam disponíveis globalmente
// (carregadas pelo script liveface.js)
declare global {
  interface Window {
    Module: any; // Objeto Emscripten
    _malloc: (size: number) => number;
    _free: (ptr: number) => void;
    HEAPU8: { set: (data: Uint8ClampedArray, ptr: number) => void };
    HEAPF32: {
      set: (data: Float32Array, ptr: number) => void;
      subarray: (start: number, end: number) => Float32Array;
    };
    _process: (
      dst: number,
      width: number,
      height: number,
      resultbuffer: number
    ) => void;
  }
}

// Constantes de limiar (ajustar conforme necessário)
const PITCH_THRESHOLD = 7;
const YAW_THRESHOLD = 7;
const ROLL_THRESHOLD = 13;
const MASK_THRESHOLD = 0.5;
const SUNGLASS_THRESHOLD = 0.5;
const EYE_DIST_THRESHOLD_MIN = 90;
const EYE_DIST_THRESHOLD_MAX = 150;
const BLURRINESS_THRESHOLD = 20;
const LUMINANCE_LOW_THRESHOLD = 50;
const LUMINANCE_HIGH_THRESHOLD = 200;
const EYE_CLOSE_THRESHOLD = 0.8;
const CENTER_R = 190; // Raio da área central

export const useKbyAiFaceCapture = (): KbyAiFaceCaptureState => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
    "Inicializando SDK..."
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Para desenho e captura
  const bestCanvasRef = useRef<HTMLCanvasElement | null>(null); // Para armazenar a melhor imagem
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [wasmLoaded, setWasmLoaded] = useState(false);

  // Efeito para verificar se o WASM foi carregado
  useEffect(() => {
    const checkWasm = () => {
      if (window.Module && window.Module.calledRun) {
        console.log("KBY-AI SDK (WASM) carregado.");
        setWasmLoaded(true);
        setIsInitializing(false);
        setFeedbackMessage("SDK pronto. Clique para iniciar a câmera."); // Mensagem inicial mais clara
      } else {
        console.log("Aguardando KBY-AI SDK (WASM)...");
        setTimeout(checkWasm, 100); // Verifica novamente em 100ms
      }
    };
    if (!wasmLoaded) {
        checkWasm();
    }
  }, [wasmLoaded]);

  // Função para iniciar a câmera
  const startCamera = useCallback(async () => {
    if (!wasmLoaded) {
      toast.error("SDK ainda não está pronto. Aguarde um momento.");
      setError("SDK ainda não está pronto.");
      return;
    }
    if (isCameraActive) return;

    console.log("Iniciando câmera...");
    setIsLoading(true);
    setError(null);
    setFeedbackMessage("Solicitando permissão da câmera..."); // Feedback durante a solicitação

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }); // Preferir câmera frontal

      // Criar elementos de vídeo e canvas dinamicamente se não existirem
      if (!videoRef.current) {
        videoRef.current = document.createElement("video");
        videoRef.current.setAttribute("playsinline", "true"); // Necessário para iOS
        videoRef.current.style.display = "none"; // Ocultar o vídeo original
        document.body.appendChild(videoRef.current);
      }
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.style.display = "none";
        document.body.appendChild(canvasRef.current);
      }
       if (!bestCanvasRef.current) {
        bestCanvasRef.current = document.createElement("canvas");
        bestCanvasRef.current.style.display = "none";
        document.body.appendChild(bestCanvasRef.current);
      }

      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();

      setIsCameraActive(true);
      setIsLoading(false);
      setFeedbackMessage("Posicione seu rosto no centro"); // Mensagem inicial após sucesso
      console.log("Câmera iniciada com sucesso.");

      // Iniciar detecção
      setIsDetecting(true);
      detectionIntervalRef.current = setInterval(checkFaceQuality, 100); // Executa a cada 100ms

    } catch (err: any) {
      console.error("Erro ao iniciar câmera:", err);
      let userFriendlyError = "Falha ao acessar a câmera.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          userFriendlyError = "Permissão da câmera negada. Verifique as configurações do navegador.";
          toast.error(userFriendlyError);
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          userFriendlyError = "Nenhuma câmera encontrada.";
          toast.error(userFriendlyError);
      } else {
          userFriendlyError = `Erro ao iniciar câmera: ${err.message}`;
          toast.error("Erro inesperado ao acessar a câmera.");
      }
      setError(userFriendlyError);
      setFeedbackMessage(userFriendlyError);
      setIsLoading(false);
      setIsCameraActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [wasmLoaded, isCameraActive]);

  // Função para parar a câmera
  const stopCamera = useCallback(() => {
    console.log("Parando câmera...");
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
       videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsDetecting(false);
    // Não resetar feedback aqui para manter a mensagem de sucesso/erro
    // setFeedbackMessage("Câmera parada.");
  }, []);

  // Função para verificar a qualidade do rosto (adaptada de main.js)
  const checkFaceQuality = useCallback(() => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current || !bestCanvasRef.current || !wasmLoaded || typeof window._process !== "function") {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const bestCanvas = bestCanvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true }); // Otimização para getImageData

    if (!ctx || video.readyState < video.HAVE_METADATA || video.videoWidth === 0) {
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let dst: number | null = null;
    let resultBuffer: number | null = null;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      dst = window._malloc(data.length);
      window.HEAPU8.set(data, dst);

      resultBuffer = window._malloc(21 * Float32Array.BYTES_PER_ELEMENT);
      window._process(dst, canvas.width, canvas.height, resultBuffer);
      const qaqarray = window.HEAPF32.subarray(resultBuffer / Float32Array.BYTES_PER_ELEMENT, resultBuffer / Float32Array.BYTES_PER_ELEMENT + 19); // Ajustado para 19 elementos (0 a 18)

      const count = qaqarray[0];
      let msg = feedbackMessage; // Manter mensagem anterior se nada mudar
      let capture = false;

      if (count === 0) {
        msg = "Nenhum rosto detectado";
      } else if (count > 1) {
        msg = "Múltiplos rostos detectados";
      } else {
        const bbox_x = qaqarray[1];
        const bbox_y = qaqarray[2];
        const bbox_w = qaqarray[3];
        const bbox_h = qaqarray[4];
        const yaw = qaqarray[5];
        const pitch = qaqarray[6];
        const roll = qaqarray[7];
        const eyeDist = qaqarray[8];
        const mask = qaqarray[9];
        const sunglass = qaqarray[10];
        const eyeClose = qaqarray[11];
        const luminance = qaqarray[16];
        const blurriness = qaqarray[17];

        const CAM_WIDTH = canvas.width;
        const CAM_HEIGHT = canvas.height;
        const center_rect_x1 = (CAM_WIDTH / 2) - CENTER_R * 0.9;
        const center_rect_y1 = (CAM_HEIGHT / 2) - CENTER_R;
        const center_rect_x2 = (CAM_WIDTH / 2) + CENTER_R * 0.9;
        const center_rect_y2 = (CAM_HEIGHT / 2) + CENTER_R * 1.1;

        if (!(bbox_x >= center_rect_x1 && bbox_y >= center_rect_y1 && bbox_x < center_rect_x2 && bbox_y < center_rect_y2 &&
              bbox_x + bbox_w >= center_rect_x1 && bbox_y + bbox_h >= center_rect_y1 && bbox_x + bbox_w < center_rect_x2 && bbox_y + bbox_h < center_rect_y2)) {
          msg = "Mova para o centro";
        } else if (Math.abs(yaw) > YAW_THRESHOLD || Math.abs(pitch) > PITCH_THRESHOLD || Math.abs(roll) > ROLL_THRESHOLD) {
           msg = "Olhe para frente";
        } else if (mask > MASK_THRESHOLD) {
          msg = "Remova a máscara";
        } else if (sunglass > SUNGLASS_THRESHOLD) {
          msg = "Remova os óculos escuros";
        } else if (eyeClose < EYE_CLOSE_THRESHOLD) {
          msg = "Abra os olhos";
        } else if (eyeDist < EYE_DIST_THRESHOLD_MIN) {
          msg = "Aproxime-se um pouco";
        } else if (eyeDist > EYE_DIST_THRESHOLD_MAX) {
          msg = "Afaste-se um pouco";
        } else if (blurriness < BLURRINESS_THRESHOLD) {
          msg = "Imagem borrada, segure firme";
        } else if (luminance < LUMINANCE_LOW_THRESHOLD) {
          msg = "Ambiente muito escuro";
        } else if (luminance > LUMINANCE_HIGH_THRESHOLD) {
          msg = "Ambiente muito claro";
        } else {
          msg = "Ótimo! Capturando imagem...";
          capture = true;
        }
      }

      // Atualizar feedback apenas se mudar
      if (msg !== feedbackMessage) {
          setFeedbackMessage(msg);
      }

      if (capture) {
          bestCanvas.width = video.videoWidth;
          bestCanvas.height = video.videoHeight;
          bestCanvas.getContext("2d")?.drawImage(video, 0, 0, bestCanvas.width, bestCanvas.height);
          const bestImageDataUrl = bestCanvas.toDataURL("image/png");
          setCapturedImage(bestImageDataUrl);
          setFeedbackMessage("Imagem capturada com sucesso!");
          toast.success("Imagem capturada!");
          stopCamera(); // Para a câmera após captura bem-sucedida
      }

    } catch (e: any) {
      console.error("Erro durante processamento do SDK:", e);
      setError("Erro no processamento da imagem.");
      // Considerar parar a detecção em caso de erro contínuo
      // stopCamera();
    } finally {
        // Liberar memória alocada pelo WASM
        if (resultBuffer !== null) window._free(resultBuffer);
        if (dst !== null) window._free(dst);
    }

  }, [isCameraActive, wasmLoaded, stopCamera, feedbackMessage]); // Adicionar feedbackMessage como dependência

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      stopCamera();
       // Limpar elementos criados dinamicamente
      if (videoRef.current) videoRef.current.remove();
      if (canvasRef.current) canvasRef.current.remove();
      if (bestCanvasRef.current) bestCanvasRef.current.remove();
    };
  }, [stopCamera]);

  return {
    isLoading,
    isInitializing,
    isCameraActive,
    isDetecting,
    feedbackMessage,
    capturedImage,
    error,
    startCamera,
    stopCamera,
  };
};

