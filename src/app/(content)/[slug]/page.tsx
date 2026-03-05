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
      <div className="container max-w-4xl mx-auto py-8 md:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8 animate-in fade-in slide-in-from-left-4 duration-700 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <Link href="/" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
            Главная
          </Link>
          <span className="opacity-40 text-xs">/</span>
          <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-full">{page.title}</span>
        </nav>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <BlockRenderer blocks={page.blocks} />
        </div>
      </div>
    </main>
  );
}
