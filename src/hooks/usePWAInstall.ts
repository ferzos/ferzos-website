import { useEffect, useState } from "react";

export const installPromptDismissedUntilKey =
  "ferzos.install-prompt.dismissed-until";

const installPromptSnoozeMs = 30 * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function dismissedUntil(now = Date.now()) {
  try {
    const stored = Number(localStorage.getItem(installPromptDismissedUntilKey));
    return Number.isFinite(stored) ? stored : 0;
  } catch {
    return 0;
  }
}

function installPromptIsSnoozed(now = Date.now()) {
  return dismissedUntil(now) > now;
}

function snoozeInstallPrompt(now = Date.now()) {
  try {
    localStorage.setItem(
      installPromptDismissedUntilKey,
      String(now + installPromptSnoozeMs),
    );
  } catch {
    // Private browsing can reject storage. The offer still stays hidden
    // for this visit.
  }
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
    const media = window.matchMedia("(display-mode: standalone)");

    const syncInstalled = () => {
      if (!media.matches) return;
      setState((prev) =>
        prev.isInstalled ? prev : { ...prev, isInstalled: true },
      );
    };

    syncInstalled();
    media.addEventListener("change", syncInstalled);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (installPromptIsSnoozed()) return;

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
      media.removeEventListener("change", syncInstalled);
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
      const promptEvent = state.installPrompt;
      setState((prev) => ({ ...prev, installPrompt: null }));
      await promptEvent.prompt();
      const result = await promptEvent.userChoice;

      if (result.outcome === "dismissed") {
        snoozeInstallPrompt();
      }

      setState((prev) => ({
        ...prev,
        canInstall: false,
      }));
    } catch (error) {
      console.error("PWA installation failed:", error);
    } finally {
      setState((prev) => ({ ...prev, isInstalling: false }));
    }
  };

  const dismissPrompt = () => {
    snoozeInstallPrompt();
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
