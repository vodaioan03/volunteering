import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { OpportunitiesProvider } from "@/context/OpportunitiesContext";
import { AuthProvider } from '@/context/AuthContext';
import { ErrorProvider } from '@/context/ErrorContext';
import { Html, Head, Main, NextScript } from 'next/document'

/* Font awesome icons imports*/
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volunteers Manager Application",
  description: "Created by Voda Ioan - University Project(In Progress...)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/photos/images.png" />
        {/* Sau pentru PNG/SVG: */}
        <link rel="icon" type="image/png" href="/photos/images.png" />
        <link rel="apple-touch-icon" href="/photos/images.png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        <ErrorProvider>
          <AuthProvider>
        <Header />
          <OpportunitiesProvider>
            {children}
          </OpportunitiesProvider>
            <Footer />
        </AuthProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}


