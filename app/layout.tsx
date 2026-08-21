import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pdf-toolboxx.vercel.app'),
  title: "Free Online PDF Tools & Converters | PDF Toolboxx",
  description:
    "Free online PDF tools. Merge, split, compress, and convert PDF files directly in your browser with 100% data privacy.",
  openGraph: {
    title: "Free Online PDF Tools & Converters | PDF Toolboxx",
    description: "Free online PDF tools. Merge, split, compress, and convert PDF files directly in your browser with 100% data privacy.",
    url: "/",
    siteName: "PDF Toolboxx",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools & Converters | PDF Toolboxx",
    description: "Free online PDF tools. Merge, split, compress, and convert PDF files directly in your browser with 100% data privacy.",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
