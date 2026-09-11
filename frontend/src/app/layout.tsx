import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Urban Flow — Intelligent Urban Logistics Platform",
  description: "A shared digital coordination layer for urban goods movement. The official Urban Flow web platform coordinating deliveries, micro-hubs, dynamic routing, and reverse logistics in Pune, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8fafd] text-[#202124] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
