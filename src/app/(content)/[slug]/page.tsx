import { getPageBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

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

export default async function DynamicPage({ params }: Props) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-8 md:py-16">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 tracking-tight">
          {page.title}
        </h1>
        
        <BlockRenderer blocks={page.blocks} />
      </div>
    </main>
  );
}
