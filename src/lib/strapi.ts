
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

        // Build request URL
        const stringifyParams = (params: Record<string, unknown>, prefix = ""): string => {
            return Object.keys(params)
                .map((key) => {
                    const value = params[key];
                    const fullKey = prefix ? `${prefix}[${key}]` : key;

                    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                        return stringifyParams(value as Record<string, unknown>, fullKey);
                    } else if (Array.isArray(value)) {
                        return (value as unknown[])
                            .map((item, index) => `${fullKey}[${index}]=${encodeURIComponent(String(item))}`)
                            .join("&");
                    } else {
                        return `${fullKey}=${encodeURIComponent(String(value))}`;
                    }
                })
                .join("&");
        };

        const queryString = stringifyParams(urlParamsObject);
        const requestUrl = `${STRAPI_API_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(response.statusText);
            throw new Error(`An error occurred please try again`);
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
    inStock?: boolean;
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
        inStock: item.inStock ?? true,
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
        subtitle: "Ищите товары со\nспециальным ценником",
        badge: "Выгодно",
        buttonText: "Подробнее",
        href: "/catalog/promo",
        gradient: "from-primary via-primary to-accent",
    },
    {
        id: 2,
        title: "НОВИНКИ\nСЕЗОНА",
        subtitle: "Свежие поступления\nот ведущих брендов",
        badge: "New",
        buttonText: "Смотреть",
        href: "/catalog/new",
        gradient: "from-accent via-accent to-primary",
    },
    {
        id: 3,
        title: "СКИДКИ\nДО 30%",
        subtitle: "На трансмиссионные\nмасла и антифризы",
        badge: "Sale",
        buttonText: "К акциям",
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

        return data.data.map((item: { id: number; name?: string; title?: string; subtitle?: string; badge?: string; buttonText?: string; href?: string; gradient?: string; image?: StrapiImage }) => ({
            id: item.id,
            title: item.name || item.title || "",
            subtitle: item.subtitle,
            badge: item.badge,
            buttonText: item.buttonText,
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

export interface StrapiCategory {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string;
}

export async function getCategories(): Promise<StrapiCategory[]> {
    try {
        const data = await fetchAPI("/categories", { sort: "name:asc" });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
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

export async function getProductById(id: string): Promise<StrapiProduct | null> {
    try {
        const data = await fetchAPI(`/products/${id}`, {
            populate: {
                image: true,
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
