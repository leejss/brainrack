import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, BBH_Sans_Bartle } from "next/font/google";

import "./globals.css";

const ibmPlexSansKR = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans-kr",
});

const bbhSansBartle = BBH_Sans_Bartle({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bbh-sans-bartle",
});

export const metadata: Metadata = {
  title: "Brainrack",
  description: "Your digital thought dumping ground.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>",
    apple:
      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>",
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
      className={`${ibmPlexSansKR.variable} ${bbhSansBartle.variable}`}
    >
      <body className="antialiased font-hand overflow-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
