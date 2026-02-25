import Image from "next/image";
import { getStrapiMedia, StrapiBlock, StrapiRichTextBlock, StrapiImageBlock, StrapiGalleryBlock } from "@/lib/strapi";
import ReactMarkdown from "react-markdown";

type BlockRendererProps = {
  blocks: StrapiBlock[];
};

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-8 md:space-y-12 w-full">
      {blocks.map((block) => {
        switch (block.__component) {
          case "blocks.rich-text": {
            const richText = block as StrapiRichTextBlock;
            return (
              <div key={`${block.__component}-${block.id}`} className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-primary">
                <ReactMarkdown>{richText.content}</ReactMarkdown>
              </div>
            );
          }
          
          case "blocks.image": {
            const imageBlock = block as StrapiImageBlock;
            if (!imageBlock.file?.url) return null;
            const imageUrl = getStrapiMedia(imageBlock.file.url);
            return (
              <div key={`${block.__component}-${block.id}`} className="relative w-full aspect-video rounded-3xl overflow-hidden bg-muted">
                <Image
                  src={imageUrl as string}
                  alt={imageBlock.file.alternativeText || "Загруженное изображение"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />
              </div>
            );
          }

          case "blocks.gallery": {
            const galleryBlock = block as StrapiGalleryBlock;
            if (!galleryBlock.images || galleryBlock.images.length === 0) return null;
            return (
              <div key={`${block.__component}-${block.id}`} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {galleryBlock.images.map((img) => (
                  <div key={img.id} className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={getStrapiMedia(img.url) as string}
                      alt={img.alternativeText || "Изображение галереи"}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            );
          }

          default:
            console.warn(`Block component not supported: ${block.__component}`);
            return null;
        }
      })}
    </div>
  );
}
