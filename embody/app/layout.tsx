import type { Metadata } from "next";

import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

import { Alata } from "next/font/google";

const alata = Alata({ subsets: ["latin"], weight: "400" });



export const metadata: Metadata = {
  title: "EmBody App",
  description: "a responsive web app to log your emotions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={alata.className}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        
      </body>
    </html>
  );
}
