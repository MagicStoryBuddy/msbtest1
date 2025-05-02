import type { Metadata } from "next";
import { Baloo_2, Nunito, Poppins, Varela_Round, Comic_Neue } from "next/font/google";
import "./globals.css";
import ScrollAnimations from "./components/ScrollAnimations";

// Load fonts with proper subsets and display
const varelaRound = Varela_Round({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-varela-round",
  display: "swap",
});

const baloo = Baloo_2({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magic Story Buddy",
  description: "Magical, personalized bedtime stories for kids ages 3–5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${baloo.variable} ${nunito.variable} ${poppins.variable} ${varelaRound.variable} ${comicNeue.variable}`}>
      <body className="font-nunito antialiased h-full">
        <ScrollAnimations />
        {children}
      </body>
    </html>
  );
}
