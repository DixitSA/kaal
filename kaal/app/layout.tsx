import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F5F0E8",
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
