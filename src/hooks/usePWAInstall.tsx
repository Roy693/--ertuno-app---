import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  isStandalone: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'other';
}

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    isInstalling: false,
    isStandalone: false,
    platform: 'other'
  });

  // Detect platform
  const detectPlatform = (): 'ios' | 'android' | 'desktop' | 'other' => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/windows|macintosh|linux/.test(userAgent)) {
      return 'desktop';
    }
    return 'other';
  };

  // Check if running in standalone mode (already installed)
  const isStandaloneMode = (): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-ignore
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  };

  useEffect(() => {
    const platform = detectPlatform();
    const isStandalone = isStandaloneMode();
    
    setState(prev => ({
      ...prev,
      platform,
      isStandalone,
      isInstalled: isStandalone
    }));

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const beforeInstallEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(beforeInstallEvent);
      setState(prev => ({ ...prev, canInstall: true }));
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, canInstall: false, isInstalling: false }));
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Install PWA function
  const installPWA = async (): Promise<{ success: boolean; error?: string }> => {
    if (!installPrompt) {
      // For iOS, provide manual instructions
      if (state.platform === 'ios') {
        return {
          success: false,
          error: 'ios_manual_install'
        };
      }
      return {
        success: false,
        error: 'No install prompt available'
      };
    }

    try {
      setState(prev => ({ ...prev, isInstalling: true }));
      
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ ...prev, isInstalled: true, canInstall: false, isInstalling: false }));
        setInstallPrompt(null);
        return { success: true };
      } else {
        setState(prev => ({ ...prev, isInstalling: false }));
        return { success: false, error: 'User dismissed install prompt' };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isInstalling: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // Get install instructions for iOS
  const getIOSInstructions = () => {
    return [
      'Open this page in Safari browser',
      'Tap the Share button at the bottom of the screen',
      'Scroll down and tap "Add to Home Screen"',
      'Tap "Add" in the top right corner'
    ];
  };

  return {
    ...state,
    installPWA,
    getIOSInstructions,
    canShowInstallButton: state.canInstall && !state.isInstalled && !state.isStandalone
  };
};