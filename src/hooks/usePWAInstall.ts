import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export function usePWAInstall(): PWAInstallState & {
  handleInstall: () => Promise<void>;
  dismissPrompt: () => void;
} {
  const [state, setState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    isInstalling: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setState((prev) => ({ ...prev, isInstalled: true }));
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setState((prev) => ({
        ...prev,
        canInstall: true,
        installPrompt: promptEvent,
      }));
    };

    const handleAppInstalled = () => {
      setState((prev) => ({
        ...prev,
        canInstall: false,
        isInstalled: true,
        installPrompt: null,
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!state.installPrompt) {
      console.warn("Install prompt not available");
      return;
    }

    setState((prev) => ({ ...prev, isInstalling: true }));

    try {
      state.installPrompt.prompt();
      const result = await state.installPrompt.userChoice;

      if (result.outcome === "accepted") {
        setState((prev) => ({
          ...prev,
          canInstall: false,
          installPrompt: null,
        }));
      }
    } catch (error) {
      console.error("PWA installation failed:", error);
    } finally {
      setState((prev) => ({ ...prev, isInstalling: false }));
    }
  };

  const dismissPrompt = () => {
    setState((prev) => ({
      ...prev,
      canInstall: false,
      installPrompt: null,
    }));
  };

  return {
    ...state,
    handleInstall,
    dismissPrompt,
  };
}
