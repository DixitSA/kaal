import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full relative" style={{ backgroundColor: "#F5F0E8" }}>
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
