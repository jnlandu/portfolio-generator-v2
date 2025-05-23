import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Assuming these are correctly set up
import "./globals.css"; //
import { AuthProvider } from '@/contexts/AuthContext'; // Adjust path if you place it elsewhere

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortfolioAI - Create Your AI-Powered Portfolio", // Updated title
  description: "Generate professional portfolios in minutes using AI.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`} // Added some base styling
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}