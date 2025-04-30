
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6433b9bdb12a4cea98df6995d5b17fe8',
  appName: 'face-connect-social',
  webDir: 'dist',
  server: {
    url: 'https://6433b9bd-b12a-4cea-98df-6995d5b17fe8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000, // Reduzido para iniciar mais rápido
      backgroundColor: "#128C7E",
      splashImmersive: true
    },
    Permissions: {
      permissions: ["camera", "storage"]
    },
    Camera: {
      presentationStyle: 'fullscreen',
      promptLabelHeader: "Acesso à Câmera",
      promptLabelCancel: "Cancelar",
      promptLabelPhoto: "Foto",
      promptLabelPicture: "Tirar Foto",
      quality: 90, // Qualidade da foto (0-100)
      width: 1280, // Largura máxima
      height: 720, // Altura máxima
      correctOrientation: true, // Corrige a orientação da foto
      saveToGallery: false // Não salvar na galeria por padrão
    },
    LocalNotifications: {
      smallIcon: "ic_notification",
      iconColor: "#128C7E"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: "#000000", // Fundo preto para melhorar visualização de câmera
    alwaysUseMediaLightMode: false, // Forçar modo escuro para a câmera
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ],
    useLegacyBridge: false // Usar novo bridge para melhorar performance
  },
  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
    backgroundColor: "#000000", // Fundo preto para melhorar visualização de câmera
    preferredContentMode: "mobile", // Modo otimizado para mobile
    permissions: [
      {
        "name": "Camera",
        "purpose": "Permitir acesso à câmera para reconhecimento facial e upload de fotos"
      },
      {
        "name": "Photos",
        "purpose": "Permitir acesso às fotos para upload de imagens"
      }
    ],
    limitsNavigationsToAppBoundDomains: true // Melhoria de segurança
  }
};

export default config;
