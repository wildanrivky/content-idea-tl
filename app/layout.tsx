import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "One App Tour Leader — One-Stop Solution for Tour Leaders",
  description:
    "Platform produktivitas all-in-one khusus Tour Leader. Generate script guiding, ide konten, dan tools profesional dalam satu dashboard terintegrasi.",
  keywords: "tour leader, script guiding, content idea, produktivitas tour leader",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="bg-navy text-white font-sans min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
