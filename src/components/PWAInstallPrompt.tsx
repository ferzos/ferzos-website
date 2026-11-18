"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";

export function PWAInstallPrompt() {
  const { canInstall, isInstalling, handleInstall, dismissPrompt } =
    usePWAInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto sm:left-auto sm:right-4 sm:max-w-md animate-in slide-in-from-bottom-4">
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-lg">
        <div className="space-y-1">
          <h3 className="font-semibold">Install Ferzos</h3>
          <p className="text-sm text-muted-foreground">
            Get quick access to tools on your phone. Install now!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (isInstalling) return;
              void handleInstall();
            }}
            aria-disabled={isInstalling}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/95 aria-disabled:opacity-50"
          >
            {isInstalling ? "Installing..." : "Install"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isInstalling) return;
              dismissPrompt();
            }}
            aria-disabled={isInstalling}
            className="flex-1 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 aria-disabled:opacity-50"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
