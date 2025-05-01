import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import ScrollAnimations from "./components/ScrollAnimations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const varelaRound = Varela_Round({
  variable: "--font-varela-round",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Magic Story Buddy",
  description: "A storytelling app for 3-5 year old children",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${varelaRound.variable} antialiased`}
      >
        <ScrollAnimations />
        {children}
      </body>
    </html>
  );
}
