
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
            cache: "no-store", // Disable caching for instant updates in development
            ...options,
        };

        // Build request URL
        const stringifyParams = (params: any, prefix = ""): string => {
            return Object.keys(params)
                .map((key) => {
                    const value = params[key];
                    const fullKey = prefix ? `${prefix}[${key}]` : key;

                    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                        return stringifyParams(value, fullKey);
                    } else if (Array.isArray(value)) {
                        return value
                            .map((item, index) => `${fullKey}[${index}]=${encodeURIComponent(item)}`)
                            .join("&");
                    } else {
                        return `${fullKey}=${encodeURIComponent(value)}`;
                    }
                })
                .join("&");
        };

        const queryString = stringifyParams(urlParamsObject);
        const requestUrl = `${STRAPI_API_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Please check if your server is running and you set all the required tokens.`);
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

export interface StrapiData<T> {
    id: number;
    documentId: string;
    attributes: T;
}

import { HeroSlide } from "@/types";

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
        // Note: This endpoint (/hero-slides) needs to be created in Strapi
        // Fields: title (Text), subtitle (Text), badge (Text), buttonText (Text), href (Text), gradient (Text), image (Media)
        const data = await fetchAPI("/hero-slides", { populate: "*" });

        if (!data?.data || data.data.length === 0) {
            return DEFAULT_SLIDES;
        }

        return data.data.map((item: any) => ({
            id: item.id,
            title: item.name || item.title,
            subtitle: item.subtitle,
            badge: item.badge,
            buttonText: item.buttonText,
            href: item.href || "/",
            gradient: item.gradient || "from-primary via-primary to-accent", // Fallback gradient
            backgroundImage: item.image?.url
                ? getStrapiMedia(item.image.url)
                : undefined
        }));
    } catch (error) {
        console.warn("Using default slides. Failed to fetch from Strapi:", error);
        return DEFAULT_SLIDES;
    }
}

export async function getCategories(): Promise<any[]> {
    try {
        const data = await fetchAPI("/categories", { sort: "name:asc" });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function getProducts(params: any = {}): Promise<StrapiResponse<any[]>> {
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

export async function getPromotions(): Promise<any[]> {
    try {
        const data = await fetchAPI("/promotions", { populate: "*" });

        if (!data?.data) return [];

        return data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            href: item.href || "/",
            image: item.image // Strapi 5 flat format
        }));
    } catch (error) {
        console.error("Failed to fetch promotions:", error);
        return [];
    }
}
