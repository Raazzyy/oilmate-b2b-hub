import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://oilmate-b2b-hub.lovable.app/og-image.jpg",
  ogType = "website",
  structuredData,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to set meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Basic meta tags
    setMetaTag("description", description);
    if (keywords) {
      setMetaTag("keywords", keywords);
    }

    // Open Graph tags
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:image", ogImage, true);
    if (canonicalUrl) {
      setMetaTag("og:url", canonicalUrl, true);
    }

    // Twitter tags
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (canonicalElement) {
        canonicalElement.setAttribute("href", canonicalUrl);
      } else {
        canonicalElement = document.createElement("link");
        canonicalElement.setAttribute("rel", "canonical");
        canonicalElement.setAttribute("href", canonicalUrl);
        document.head.appendChild(canonicalElement);
      }
    }

    // Structured data (JSON-LD)
    const existingScript = document.querySelector('script[data-seo-jsonld]');
    if (existingScript) {
      existingScript.remove();
    }
    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup structured data on unmount
      const script = document.querySelector('script[data-seo-jsonld]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData]);

  return null;
};

export default SEO;
