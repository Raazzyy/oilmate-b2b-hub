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
              <div 
                key={`${block.__component}-${block.id}`} 
                className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none 
                           prose-img:rounded-3xl prose-img:shadow-2xl prose-headings:font-black 
                           prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline 
                           hover:prose-a:underline transition-all"
              >
                <ReactMarkdown>{richText.content}</ReactMarkdown>
              </div>
            );
          }
          
          case "blocks.image": {
            const imageBlock = block as StrapiImageBlock;
            if (!imageBlock.file?.url) return null;
            const imageUrl = getStrapiMedia(imageBlock.file.url);
            return (
              <div 
                key={`${block.__component}-${block.id}`} 
                className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden 
                           bg-muted shadow-2xl shadow-primary/5 border border-primary/5"
              >
                <Image
                  src={imageUrl as string}
                  alt={imageBlock.file.alternativeText || "Загруженное изображение"}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            );
          }

          case "blocks.gallery": {
            const galleryBlock = block as StrapiGalleryBlock;
            if (!galleryBlock.images || galleryBlock.images.length === 0) return null;
            return (
              <div key={`${block.__component}-${block.id}`} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {galleryBlock.images.map((img) => (
                  <div 
                    key={img.id} 
                    className="relative w-full aspect-square rounded-3xl overflow-hidden 
                               bg-muted shadow-xl shadow-primary/5 border border-primary/5 group"
                  >
                    <Image
                      src={getStrapiMedia(img.url) as string}
                      alt={img.alternativeText || "Изображение галереи"}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
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
