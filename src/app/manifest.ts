import type { MetadataRoute } from "next";
import icon192 from "./web-app-manifest-192x192.png";
import icon512 from "./web-app-manifest-512x512.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ferzos",
    short_name: "Ferzos",
    description: "Tools and insights for better decisions.",
    start_url: "/optimal-stopping",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: icon192.src,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: icon512.src,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}