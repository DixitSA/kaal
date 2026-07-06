import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Quattrocento_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import BackgroundPattern from "@/components/svg/BackgroundPattern";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const quattrocentoSans = Quattrocento_Sans({
  variable: "--font-quattrocento-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "var(--bg-cream)",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getkaal.com"),
  title: {
    default: "Kaal",
    template: "%s · Kaal",
  },
  description: "Vedic timing, read daily. Know what's happening. Know what to do.",
  openGraph: {
    title: "Kaal",
    description: "Vedic timing, read daily. Know what's happening. Know what to do.",
    url: "https://www.getkaal.com",
    siteName: "Kaal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaal",
    description: "Vedic timing, read daily. Know what's happening. Know what to do.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${quattrocentoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full relative" style={{ backgroundColor: "var(--bg-cream)" }}>
        <BackgroundPattern />
        <UserProvider>
          <div className="relative z-10">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
