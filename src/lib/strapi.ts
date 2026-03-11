
export const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

/**
 * Helper to get the full URL for Strapi media
 */
export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return formatted URL
    if (url.startsWith("data:")) {
        return url;
    }
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }
    return `${STRAPI_API_URL}${url}`;
}

import qs from "qs";

/**
 * Generic fetcher for Strapi API
 */
export async function fetchAPI(
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    urlParamsObject: Record<string, any> = {},
    options: RequestInit = {}
) {
    try {
        // Merge default and user options
        const mergedOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 }, // Default 1 minute revalidation
            ...options,
        };

        const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
        const requestUrl = `${STRAPI_API_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);

        if (response.status === 404) {
            console.warn(`[Strapi API] 404 Not Found: ${requestUrl}`);
            return { data: null };
        }

        if (!response.ok) {
            console.error(response.statusText);
            throw new Error(`An error occurred please try again: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Types for Strapi Responses
 */
export interface StrapiResponse<T> {
    data: T;
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiImage {
    id?: number;
    documentId?: string;
    url: string;
    alternativeText?: string;
    formats?: Record<string, unknown>;
}

export interface StrapiProduct {
    id: number;
    documentId: string;
    name: string;
    brand?: string;
    volume?: string;
    price: number;
    oldPrice?: number;
    image?: StrapiImage;
    images?: StrapiImage[];
    description?: string;
    inStock?: boolean;
    stock?: number;
    oilType?: string;
    isUniversal?: boolean;
    category?: {
        slug: string;
        name: string;
    };
    country?: string;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        metaImage?: StrapiImage;
        canonicalURL?: string;
        keywords?: string;
    };
    [key: string]: unknown;
}

import { HeroSlide } from "@/types";
import { ProductData } from "@/data/products";

/**
 * Map Strapi product to UI ProductData
 */
export function mapStrapiProduct(item: StrapiProduct): ProductData {
    return {
        id: item.id,
        documentId: item.documentId,
        name: item.name,
        brand: item.brand || "",
        volume: item.volume || "",
        price: item.price,
        oldPrice: item.oldPrice,
        image: getStrapiMedia(item.image?.url) || "/oil-product.png",
        images: item.images?.map(img => getStrapiMedia(img.url)).filter(Boolean) as string[] | undefined,
        description: item.description,
        inStock: item.inStock ?? true,
        stock: item.stock,
        oilType: item.oilType || "",
        isUniversal: item.isUniversal,
        category: item.category?.slug || "all",
        viscosity: item.viscosity as string,
        approvals: item.approvals as string,
        specification: item.specification as string,
        viscosityClass: item.viscosityClass as string,
        application: item.application as string,
        standard: item.standard as string,
        color: item.color as string,
        type: item.type as string,
        rating: item.rating as number,
        isNew: item.isNew as boolean,
        isHit: item.isHit as boolean,
        country: item.country as string,
    };
}

const DEFAULT_SLIDES: HeroSlide[] = [
    {
        id: 1,
        title: "ЦЕНТР\nНИЗКИХ\nЦЕН",
        href: "/catalog/promo",
        gradient: "from-primary via-primary to-accent",
    },
    {
        id: 2,
        title: "НОВИНКИ\nСЕЗОНА",
        href: "/catalog/new",
        gradient: "from-accent via-accent to-primary",
    },
    {
        id: 3,
        title: "СКИДКИ\nДО 30%",
        href: "/catalog/promo",
        gradient: "from-primary via-accent to-primary",
    },
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
    try {
        const data = await fetchAPI("/hero-slides", { populate: "*" });

        if (!data?.data || data.data.length === 0) {
            return DEFAULT_SLIDES;
        }

        return data.data.map((item: { id: number; name?: string; title?: string; href?: string; gradient?: string; image?: StrapiImage }) => ({
            id: item.id,
            title: item.name || item.title || "",
            href: item.href || "/",
            gradient: item.gradient || "from-primary via-primary to-accent",
            backgroundImage: item.image?.url
                ? getStrapiMedia(item.image.url)
                : undefined
        }));
    } catch (error) {
        console.warn("Using default slides. Failed to fetch from Strapi:", error);
        return DEFAULT_SLIDES;
    }
}

export interface StrapiFilter {
    id: number;
    name: string;
    slug: string;
    type: 'chips' | 'range';
    options?: string[];
}

export interface StrapiCategory {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string;
    image?: StrapiImage;
    filters?: StrapiFilter[];
}

export async function getCategories(): Promise<StrapiCategory[]> {
    try {
        const data = await fetchAPI("/categories", { sort: "name:asc", populate: { image: true, filters: true } }, { next: { revalidate: 60 } });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function getCategoryBySlug(slug: string): Promise<StrapiCategory | null> {
    try {
        const data = await fetchAPI("/categories", {
            filters: { slug: { $eq: slug } },
            populate: { filters: true, image: true }
        });
        if (!data?.data || data.data.length === 0) return null;
        return data.data[0];
    } catch (error) {
        console.error(`Failed to fetch category ${slug}:`, error);
        return null;
    }
}


export async function getHomepageCategories(): Promise<StrapiCategory[]> {
    try {
        const data = await fetchAPI("/homepage", {
            populate: {
                featuredCategories: {
                    populate: {
                        image: true
                    }
                }
            }
        }, { next: { revalidate: 0 } });

        const categories = data?.data?.featuredCategories;

        if (!categories || categories.length === 0) {
            console.log("No featured categories found on homepage, falling back to all categories.");
            return getCategories();
        }

        return categories;
    } catch (error) {
        console.warn("Failed to fetch homepage categories, falling back to all categories:", error);
        return getCategories();
    }
}

export async function getHomepageProducts(): Promise<ProductData[]> {
    try {
        const data = await fetchAPI("/homepage", {
            populate: {
                featuredProducts: {
                    populate: {
                        image: true,
                        category: true
                    }
                }
            }
        }, { next: { revalidate: 0 } });

        const products = data?.data?.featuredProducts;

        if (!products || products.length === 0) {
            console.log("No featured products found on homepage, falling back to hit products.");
            const productsResponse = await getProducts({
                pagination: { limit: 10 },
                filters: { isHit: { $eq: true } }
            });
            return (productsResponse.data as StrapiProduct[]).map(mapStrapiProduct);
        }

        return (products as StrapiProduct[]).map(mapStrapiProduct);
    } catch (error) {
        console.warn("Failed to fetch homepage products, falling back to hits:", error);
        const productsResponse = await getProducts({
            pagination: { limit: 10 },
            filters: { isHit: { $eq: true } }
        });
        return (productsResponse.data as StrapiProduct[]).map(mapStrapiProduct);
    }
}


export async function getProducts(params: Record<string, unknown> = {}): Promise<StrapiResponse<StrapiProduct[]>> {
    try {
        const data = await fetchAPI("/products", {
            populate: "*",
            ...params
        });

        if (!data || !data.data) {
            return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
    }
}

/**
 * Automatically generates filter options based on the available products in a category.
 * It fetches up to 1000 products to aggregate unique values for filterable attributes.
 */
export async function getCategoryFilterOptions(categorySlug?: string): Promise<StrapiFilter[]> {
    try {
        const filters: Record<string, unknown> = {};
        if (categorySlug && categorySlug !== "all") {
            filters.category = { slug: { $eq: categorySlug } };
        }

        // Fetch up to 1000 products to find unique attributes
        const response = await fetchAPI("/products", {
            filters,
            pagination: { limit: 1000 },
            fields: ['brand', 'volume', 'viscosity', 'oilType', 'approvals', 'type', 'viscosityClass', 'country']
        });

        if (!response?.data || response.data.length === 0) {
            return [];
        }

        const products = response.data as StrapiProduct[];

        // Maps to hold unique values for each attribute
        const attributeValues: Record<string, Set<string>> = {
            brand: new Set(),
            volume: new Set(),
            viscosity: new Set(),
            oilType: new Set(),
            approvals: new Set(),
            type: new Set(),
            viscosityClass: new Set(),
            country: new Set(),
        };

        products.forEach(p => {
            if (p.brand) attributeValues.brand.add(p.brand);
            if (p.volume) attributeValues.volume.add(p.volume);
            if (p.viscosity) attributeValues.viscosity.add(p.viscosity as string);
            if (p.oilType) attributeValues.oilType.add(p.oilType);
            if (p.type) attributeValues.type.add(p.type as string);
            if (p.viscosityClass) attributeValues.viscosityClass.add(p.viscosityClass as string);
            if (p.country) attributeValues.country.add(p.country as string);

            // Approvals can be comma-separated, try to split them nicely if applicable
            // For now just add as is, assuming they are neat strings in DB
            if (p.approvals) {
                const apps = (p.approvals as string).split(',').map(s => s.trim()).filter(Boolean);
                apps.forEach(a => attributeValues.approvals.add(a));
            }
        });

        const autoFilters: StrapiFilter[] = [];
        let idCounter = 1;

        const addFilterIfHasOptions = (slug: string, name: string) => {
            const options = Array.from(attributeValues[slug]).sort();
            if (options.length > 0) {
                autoFilters.push({
                    id: idCounter++,
                    name,
                    slug,
                    type: 'chips',
                    options
                });
            }
        };

        // Add them in a logical order
        addFilterIfHasOptions('brand', 'Бренд');
        addFilterIfHasOptions('volume', 'Объем');
        addFilterIfHasOptions('viscosity', 'Вязкость');
        addFilterIfHasOptions('oilType', 'Тип масла');
        addFilterIfHasOptions('approvals', 'Допуски');
        addFilterIfHasOptions('type', 'Тип');
        addFilterIfHasOptions('viscosityClass', 'Класс вязкости');
        addFilterIfHasOptions('country', 'Страна-производитель');

        return autoFilters;

    } catch (error) {
        console.error("Failed to generate category filters:", error);
        return [];
    }
}


export async function getProductById(id: string): Promise<StrapiProduct | null> {
    try {
        const data = await fetchAPI(`/products/${id}`, {
            populate: {
                image: true,
                images: true,
                category: true,
                seo: {
                    populate: "*"
                }
            }
        });
        return data?.data || null;
    } catch (error) {
        console.error(`Failed to fetch product with id ${id}:`, error);
        return null;
    }
}

export async function getPromotions(): Promise<{ id: number; documentId: string; title?: string; href: string; image?: StrapiImage }[]> {
    try {
        const data = await fetchAPI("/promotions", { populate: "*" });

        if (!data?.data) return [];

        return data.data.map((item: { id: number; documentId: string; title?: string; href: string; image?: StrapiImage }) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            href: item.href || "/",
            image: item.image
        }));
    } catch (error) {
        console.error("Failed to fetch promotions:", error);
        return [];
    }
}

// --- Dynamic Pages (Strapi Dynamic Zones) ---

export interface StrapiBlock {
    id: number;
    __component: string;
    [key: string]: unknown; // Specific fields depend on the component
}

export interface StrapiRichTextBlock extends StrapiBlock {
    __component: "blocks.rich-text";
    content: string; // Markdown/HTML from Strapi
}

export interface StrapiImageBlock extends StrapiBlock {
    __component: "blocks.image";
    file: StrapiImage;
}

export interface StrapiGalleryBlock extends StrapiBlock {
    __component: "blocks.gallery";
    images: StrapiImage[];
}

export interface StrapiSEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalURL?: string;
    ogImage?: StrapiImage;
    structuredData?: unknown;
}

export interface StrapiPage {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    seo?: StrapiSEO;
    blocks: (StrapiRichTextBlock | StrapiImageBlock | StrapiGalleryBlock)[];
}

export async function getPageBySlug(slug: string): Promise<StrapiPage | null> {
    try {
        const data = await fetchAPI("/pages", {
            filters: { slug: { $eq: slug } },
            populate: {
                seo: { populate: "*" },
                blocks: {
                    populate: "*" // Populates the media inside blocks
                }
            }
        });

        if (!data || !data.data || data.data.length === 0) {
            return null;
        }

        return data.data[0];
    } catch (error) {
        console.error(`Failed to fetch page with slug ${slug}:`, error);
        return null;
    }
}

// --- Dynamic Navigation ---

export interface StrapiNavigationItem {
    id: number;
    documentId: string;
    label: string;
    href: string;
    order: number;
}

export async function getNavigationItems(): Promise<StrapiNavigationItem[]> {
    try {
        const data = await fetchAPI("/navigation-items", { sort: "order:asc" });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch navigation items:", error);
        return [];
    }
}
