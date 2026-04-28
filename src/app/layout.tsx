import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Quattrocento_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import BackgroundPattern from "@/components/svg/BackgroundPattern";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  themeColor: "#F5F0E8",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Kaal",
  description: "Know what's happening. Know what to do.",
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
      <body className="min-h-full relative" style={{ backgroundColor: "#F5F0E8" }}>
        <BackgroundPattern />
        <UserProvider>
          <div className="relative z-10">
            {children}
          </div>
        </UserProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}