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

export const metadata: Metadata = {
  title: "MapMind — Играй и узнавай мир",
  description: "Викторины по географии: столицы, флаги, фото стран. Играй в одиночку или в дуэли!",
  keywords: ["география", "викторина", "квиз", "флаги", "столицы", "страны", "игра", "дуэль"],
  authors: [{ name: "MapMind Team" }],
  creator: "MapMind Team",
  openGraph: {
    title: "MapMind — Играй и узнавай мир",
    description: "Открой мир через викторины: страны, флаги, столицы!",
    // url: "https://your-quiz-app.com", 
    siteName: "MapMind",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru" className={`${play.variable} ${nunito.variable}`}>
      <body>
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}