
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import BottomNav from "@/components/BottomNav";
import YandexMetrika from "@/components/YandexMetrika";
import { getNavCategories, getNavigationItems, getFooterData, getWebsiteSettings } from "@/lib/strapi";
 
const inter = Inter({ subsets: ["latin", "cyrillic"] });
 
export const dynamic = "force-dynamic";
 
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings();
  const siteTitle = settings.siteName || "OilMate";
  
  const metadata: Metadata = {
    title: {
      template: `%s | ${siteTitle}`,
      default: siteTitle,
    },
    description: "OilMate — оптовый интернет-магазин моторных масел, автохимии и смазочных материалов.",
    metadataBase: new URL("https://oilmate-b2b-hub.vercel.app"),
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: "https://oilmate-b2b-hub.vercel.app",
      siteName: siteTitle,
    },
    manifest: "/manifest.json",
  };
 
  return metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getNavCategories();
  const navigation = await getNavigationItems();
  const footerData = await getFooterData();
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Header categories={categories} navigation={navigation} />
            <main className="pb-5 md:pb-0">{children}</main>
          <Footer data={footerData} />
          <CartDrawer />
          <BottomNav />
          <CookieConsent />
        </Providers>
        {process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID && (
          <YandexMetrika ymid={process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID} />
        )}
      </body>
    </html>
  );
}
