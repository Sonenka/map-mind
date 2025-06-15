import type { Metadata } from "next";
import { Play, Nunito } from "next/font/google";
import "./globals.css";

import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProviderWrapper from "./SessionProviderWrapper";

const play = Play({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-play",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nunito",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${play.variable} ${nunito.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}