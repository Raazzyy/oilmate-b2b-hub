
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming Inter was used or can be used
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header"; // We will need to check if Header relies on specific Router hooks
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";

// Note: We might need to adjust Header/CartDrawer if they use 'react-router-dom'.
// We will address that in the next steps.

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "OilMate — Масла и автохимия оптом | B2B интернет-магазин",
  description: "OilMate — оптовый интернет-магазин моторных масел, автохимии и смазочных материалов.",
  metadataBase: new URL("https://oilmate-b2b-hub.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Header />
            {children}
          <Footer />
          <CartDrawer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
