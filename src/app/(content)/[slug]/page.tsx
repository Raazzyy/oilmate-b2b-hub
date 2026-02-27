import { getPageBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Страница не найдена",
    };
  }

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
  };
}

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      
      <div className="container max-w-4xl mx-auto py-8 md:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate">{page.title}</span>
        </nav>

        <header className="mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            {page.title}
          </h1>
          <div className="h-1.5 w-24 bg-primary rounded-full" />
        </header>
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <BlockRenderer blocks={page.blocks} />
        </div>
      </div>
    </main>
  );
}
