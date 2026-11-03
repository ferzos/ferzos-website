"use client";

import { useEffect, useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function PWAInstallPrompt() {
  const { canInstall, isInstalling, handleInstall, dismissPrompt } =
    usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(canInstall);
  }, [canInstall]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto sm:left-auto sm:right-4 sm:max-w-md animate-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Install Ferzos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get quick access to tools on your phone. Install now!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isInstalling ? "Installing..." : "Install"}
          </button>
          <button
            onClick={dismissPrompt}
            disabled={isInstalling}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
