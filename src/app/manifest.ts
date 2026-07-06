import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaal",
    short_name: "Kaal",
    description: "Know what's happening. Know what to do.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "var(--bg-cream)",
    theme_color: "var(--bg-cream)",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
