import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { cn } from "@/lib/utils";
import appleTouchIcon from "./apple-touch-icon.png";
import { ServiceWorkerRegistration } from "./service-worker-registration";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Ferzos",
  title: "Ferzos",
  description: "Tools and insights for better decisions.",
  icons: {
    apple: [{ url: appleTouchIcon.src, sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e0f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geistSans.variable)}
    >
      <body className="flex min-h-full flex-col">
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <header className="border-b border-border/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5 sm:px-10">
            <div className="flex items-center gap-3">
              <Image
                src={appleTouchIcon}
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-lg"
              />
              <p className="text-xl font-semibold tracking-tight text-primary">
                Ferzos
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Small tools for decisions you can finish.
            </p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
