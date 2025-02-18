import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import AuthProvider from "@/app/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Agency Platform",
  description: "Streamlining event planning for clients & agencies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}>
        <AuthProvider>
          {/* Global Navbar */}
          <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">Event Platform</Link>
            <nav>
              <Link href="/landing" className="mr-4 text-blue-600 hover:underline">Landing</Link>
              <Link href="/event-request" className="mr-4 text-blue-600 hover:underline">Request Event</Link>
              <Link href="/signup">
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition">
                  Sign Up / Login
                </button>
              </Link>
            </nav>
          </header>
          <main className="container mx-auto p-6">{children}</main>
          {/* Footer */}
          <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
            <p>© 2024 Event Platform. All rights reserved.</p>
            <div className="mt-2">
              <Link href="/terms" className="cursor-pointer hover:underline">Terms</Link> | 
              <Link href="/privacy" className="cursor-pointer hover:underline"> Privacy Policy</Link>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
