
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
            next: { revalidate: 0 }, // Force fresh data during development/debugging
            ...options,
        };

        const queryString = qs.stringify({ ...urlParamsObject, _t: Date.now() }, { encodeValuesOnly: true });
        const requestUrl = `${STRAPI_API_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);

        if (response.status === 404) {
            console.warn(`[Strapi API] 404 Not Found: ${requestUrl}`);
            return { data: null };
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[Strapi API Error] ${response.status} ${response.statusText}:`, errorData);
            throw new Error(`An error occurred please try again: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        // console.log(`[Strapi Debug] ${path} raw data:`, JSON.stringify(data).substring(0, 500) + "...");
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
    sku?: string;
    label?: string;
    supplierName?: string;
    supplierDescription?: string;
    supplierLogo?: StrapiImage;
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
    characteristics?: {
        id: number;
        key: string;
        value: string;
    }[];
    relatedProducts?: StrapiProduct[];
    [key: string]: unknown;
}

import { HeroSlide, Promotion } from "@/types";
import { ProductData } from "@/data/products";

/**
 * Map Strapi product to UI ProductData
 */
export function mapStrapiProduct(item: StrapiProduct): ProductData {
    const attrs = (item as unknown as { attributes: StrapiProduct }).attributes || item;
    
    const mapped: ProductData = {
        id: item.id,
        documentId: item.documentId,
        sku: attrs.sku,
        label: attrs.label,
        supplierName: attrs.supplierName,
        supplierDescription: attrs.supplierDescription,
        supplierLogo: getStrapiMedia(attrs.supplierLogo?.url),
        name: attrs.name,
        brand: attrs.brand || "",
        volume: attrs.volume || "",
        price: attrs.price,
        oldPrice: attrs.oldPrice,
        image: getStrapiMedia(attrs.image?.url) || "/oil-product.png",
        images: attrs.images?.map((img: StrapiImage) => getStrapiMedia(img.url)).filter(Boolean) as string[] | undefined,
        description: attrs.description,
        inStock: attrs.inStock ?? true,
        stock: attrs.stock,
        oilType: attrs.oilType || "",
        isUniversal: attrs.isUniversal,
        category: attrs.category?.slug || "all",
        viscosity: attrs.viscosity as string,
        approvals: attrs.approvals as string,
        specification: attrs.specification as string,
        viscosityClass: attrs.viscosityClass as string,
        application: attrs.application as string,
        standard: attrs.standard as string,
        color: attrs.color as string,
        type: attrs.type as string,
        rating: attrs.rating as number,
        isNew: attrs.isNew as boolean,
        isHit: attrs.isHit as boolean,
        country: attrs.country as string,
        characteristics: attrs.characteristics,
        relatedProducts: attrs.relatedProducts?.map((p: StrapiProduct) => mapStrapiProduct(p)),
    };
    console.log(`[Strapi Map] Product ${item.id}:`, {
        name: mapped.name,
        price: mapped.price,
        oldPrice: mapped.oldPrice,
        label: mapped.label
    });
    return mapped;
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

interface StrapiHeroSlideItem {
    id: number;
    name?: string;
    title?: string;
    href?: string;
    gradient?: string;
    image?: StrapiImage;
    desktopImage?: StrapiImage;
    isActive?: boolean;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    try {
        // Fetch from Homepage single type to respect drag-and-drop order
        const data = await fetchAPI("/homepage", { 
            populate: {
                heroSlides: {
                    populate: "*",
                }
            }
        });

        const slides = data?.data?.heroSlides;

        if (!slides || slides.length === 0) {
            // Fallback to all active slides if homepage is not configured
            const allSlidesData = await fetchAPI("/hero-slides", { 
                populate: "*",
                filters: { isActive: { $ne: false } }
            });
            
            if (!allSlidesData?.data || allSlidesData.data.length === 0) {
                return DEFAULT_SLIDES;
            }
            return allSlidesData.data.map((item: StrapiHeroSlideItem) => ({
                id: item.id,
                title: item.name || item.title || "",
                href: item.href || "/",
                gradient: item.gradient || "from-primary via-primary to-accent",
                backgroundImage: item.image?.url ? getStrapiMedia(item.image.url) : undefined,
                desktopImage: item.desktopImage?.url ? getStrapiMedia(item.desktopImage.url) : undefined
            }));
        }

        return slides
            .filter((item: StrapiHeroSlideItem) => item.isActive !== false)
            .map((item: StrapiHeroSlideItem) => ({
                id: item.id,
                title: item.name || item.title || "",
                href: item.href || "/",
                gradient: item.gradient || "from-primary via-primary to-accent",
                backgroundImage: item.image?.url ? getStrapiMedia(item.image.url) : undefined,
                desktopImage: item.desktopImage?.url ? getStrapiMedia(item.desktopImage.url) : undefined
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
    showInNav?: boolean;
}

export async function getCategories(): Promise<StrapiCategory[]> {
    try {
        const data = await fetchAPI("/categories", { sort: "name:asc", populate: { image: true, filters: true } }, { next: { revalidate: 0 } });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

/**
 * Returns only categories where showInNav is true.
 * Used by the Header dropdown to control which categories are shown.
 */
export async function getNavCategories(): Promise<StrapiCategory[]> {
    try {
        const data = await fetchAPI("/categories", {
            sort: "name:asc",
            populate: { image: true },
            filters: { showInNav: { $eq: true } }
        }, { next: { revalidate: 0 } });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch nav categories:", error);
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
                    populate: "*"
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
        // 1. Fetch the category with its manual filters
        let manualFilters: StrapiFilter[] = [];
        if (categorySlug && categorySlug !== "all") {
            const cat = await getCategoryBySlug(categorySlug);
            if (cat?.filters && cat.filters.length > 0) {
                manualFilters = cat.filters;
            }
        }

        const filters: Record<string, unknown> = {};
        if (categorySlug && categorySlug !== "all") {
            filters.category = { slug: { $eq: categorySlug } };
        }

        // 2. Aggregate values
        // Fetch products with necessary fields
        const coreFields = ['brand', 'volume', 'viscosity', 'oilType', 'approvals', 'type', 'viscosityClass', 'country'];
        const response = await fetchAPI("/products", {
            filters,
            pagination: { pageSize: 60 },
            populate: { characteristics: true },
            fields: ['id', 'documentId', ...coreFields]
        });

        if (!response?.data || response.data.length === 0) {
            return manualFilters.length > 0 ? manualFilters : [];
        }

        const products = response.data as StrapiProduct[];

        // A map to store options for each relevant slug
        const aggregatedOptions: Record<string, Set<string>> = {};

        // If manual filters exist, only aggregate for those
        // Otherwise, aggregate for all core fields
        const targetSlugs = manualFilters.length > 0 
            ? manualFilters.map(f => f.slug)
            : coreFields;
        
        targetSlugs.forEach(slug => aggregatedOptions[slug] = new Set());

        products.forEach(p => {
            const attrs = (p as unknown as { attributes: StrapiProduct }).attributes || p;
            
            // Check core fields
            coreFields.forEach(field => {
                if (aggregatedOptions[field] && attrs[field]) {
                    const val = attrs[field];
                    if (field === 'approvals' && typeof val === 'string') {
                         val.split(',').map(s => s.trim()).filter(Boolean).forEach(a => aggregatedOptions[field].add(a));
                    } else if (typeof val === 'string') {
                        aggregatedOptions[field].add(val);
                    }
                }
            });

            // Check dynamic characteristics
            if (attrs.characteristics) {
                attrs.characteristics.forEach(char => {
                    if (aggregatedOptions[char.key] && char.value) {
                        aggregatedOptions[char.key].add(char.value);
                    }
                });
            }
        });

        // 3. Construct final filters
        if (manualFilters.length > 0) {
            return manualFilters.map(f => ({
                ...f,
                options: Array.from(aggregatedOptions[f.slug] || []).sort()
            })).filter(f => f.options && f.options.length > 0);
        }

        // Fallback: existing auto-logic
        const autoFilters: StrapiFilter[] = [];
        const coreNames: Record<string, string> = {
            brand: 'Бренд',
            volume: 'Объем',
            viscosity: 'Вязкость',
            oilType: 'Тип масла',
            approvals: 'Допуски',
            type: 'Тип',
            viscosityClass: 'Класс вязкости',
            country: 'Страна-производитель'
        };

        coreFields.forEach(field => {
            const options = Array.from(aggregatedOptions[field]).sort();
            if (options.length > 0) {
                autoFilters.push({
                    id: Math.random(), // transient id
                    name: coreNames[field] || field,
                    slug: field,
                    type: 'chips',
                    options
                });
            }
        });

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
                supplierLogo: true,
                category: true,
                seo: {
                    populate: "*"
                },
                relatedProducts: {
                    populate: {
                        image: true,
                        category: true
                    }
                }
            }
        });
        return data?.data || null;
    } catch (error) {
        console.error(`Failed to fetch product with id ${id}:`, error);
        return null;
    }
}

interface StrapiPromotionItem {
    id: number;
    title?: string;
    href?: string;
    image?: StrapiImage;
    desktopImage?: StrapiImage;
    isActive?: boolean;
}

export async function getPromotions(): Promise<Promotion[]> {
    try {
        // Fetch from Homepage single type to respect drag-and-drop order
        const data = await fetchAPI("/homepage", { 
            populate: {
                promotions: {
                    populate: "*",
                }
            }
        });

        const promos = data?.data?.promotions;

        if (!promos || promos.length === 0) {
            // Fallback to all active promotions
            const allPromosData = await fetchAPI("/promotions", { 
                populate: "*",
                filters: { isActive: { $ne: false } }
            });
            
            if (!allPromosData?.data) return [];
            return allPromosData.data.map((item: StrapiPromotionItem) => ({
                id: item.id,
                title: item.title,
                href: item.href || "/",
                image: item.image?.url ? getStrapiMedia(item.image.url) : undefined,
                desktopImage: item.desktopImage?.url ? getStrapiMedia(item.desktopImage.url) : undefined
            }));
        }

        return promos
            .filter((item: StrapiPromotionItem) => item.isActive !== false)
            .map((item: StrapiPromotionItem) => ({
                id: item.id,
                title: item.title,
                href: item.href || "/",
                image: item.image?.url ? getStrapiMedia(item.image.url) : undefined,
                desktopImage: item.desktopImage?.url ? getStrapiMedia(item.desktopImage.url) : undefined
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
