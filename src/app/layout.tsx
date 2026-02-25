
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import { getCategories, getNavigationItems } from "@/lib/strapi";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    template: "%s | OilMate",
    default: "OilMate — Масла и автохимия оптом | B2B интернет-магазин",
  },
  description: "OilMate — оптовый интернет-магазин моторных масел, автохимии и смазочных материалов.",
  metadataBase: new URL("https://oilmate-b2b-hub.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://oilmate-b2b-hub.vercel.app",
    siteName: "OilMate B2B",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  const navigation = await getNavigationItems();
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Header categories={categories} navigation={navigation} />
            {children}
          <Footer />
          <CartDrawer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
