
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
      launchShowDuration: 2000,
      backgroundColor: "#128C7E",
      splashImmersive: true
    }
  }
};

export default config;
