import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { OpportunitiesProvider } from "@/context/OpportunitiesContext";
import { AuthProvider } from '@/context/AuthContext';
import { ErrorProvider } from '@/context/ErrorContext';

/* Font awesome icons imports*/
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

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
  openGraph: {
    images: [
      {
        url: 'https://nonprofitssource.com/wp-content/uploads/2019/05/Volunteering-Statistics-and-Trends-Nonprofits-Source.jpg',
        width: 1200,
        height: 630,
      }
    ]
  },
  icons: {
    icon: 'https://nonprofitssource.com/wp-content/uploads/2019/05/Volunteering-Statistics-and-Trends-Nonprofits-Source.jpg',
    apple: 'https://nonprofitssource.com/wp-content/uploads/2019/05/Volunteering-Statistics-and-Trends-Nonprofits-Source.jpg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
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


