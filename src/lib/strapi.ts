
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
 * Ensures social media links are absolute URLs
 */
export function formatSocialUrl(url: string | undefined, type: 'telegram' | 'vk'): string {
    if (!url || url === "#") return "#";
    
    // If it's already an absolute URL, return as is
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    // Handle common prefixes without protocol
    if (url.startsWith("t.me/") || url.startsWith("vk.com/")) {
        return `https://${url}`;
    }

    // Handle bare handles
    if (type === 'telegram') {
        return `https://t.me/${url.replace(/^@/, '')}`;
    }
    if (type === 'vk') {
        return `https://vk.com/${url}`;
    }

    return url;
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

export interface StrapiAttribute {
    id: number;
    documentId: string;
    name: string;
    slug: string;
}

export interface StrapiProductAttribute {
    id: number;
    attribute?: StrapiAttribute;
    value: string;
    isFilter: boolean;
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
    price: number;
    oldPrice?: number;
    image?: StrapiImage;
    images?: StrapiImage[];
    description?: string;
    inStock?: boolean;
    stock?: number;
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
    productAttributes?: StrapiProductAttribute[];
    relatedProducts?: StrapiProduct[];
    [key: string]: unknown;
}

export interface StrapiTransportCompany {
    id: number | string;
    documentId?: string;
    name: string;
    description: string;
    calcUrl: string;
    badgeText?: string;
    showBadge: boolean;
    publishedAt?: string;
}

export interface CheckoutSettings {
    pickupEnabled: boolean;
    cityDeliveryEnabled: boolean;
    shippingEnabled: boolean;
}


import { HeroSlide, Promotion } from "@/types";
import { ProductData } from "@/data/products";

/**
 * Map Strapi product to UI ProductData
 */
export function mapStrapiProduct(item: StrapiProduct): ProductData {
    const attrs = (item as unknown as { attributes: StrapiProduct }).attributes || item;
    
    // Process attributes gracefully supporting Strapi v4/v5 payload formats
    const rawAttrs = attrs.productAttributes || [];
    const mappedAttrs = rawAttrs.map((pa: StrapiProductAttribute) => {
        // Handle Strapi v4 nested attributes if present
        const attrData = (pa.attribute as unknown as { data?: { attributes?: StrapiAttribute } })?.data?.attributes 
                      || (pa.attribute as unknown as { attributes?: StrapiAttribute })?.attributes 
                      || pa.attribute;
                      
        return {
            id: pa.id,
            name: attrData?.name || "Неизвестно",
            slug: attrData?.slug || "unknown",
            value: pa.value,
            isFilter: pa.isFilter ?? false
        };
    }).filter(a => a.name !== "Неизвестно");

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
        price: attrs.price,
        oldPrice: attrs.oldPrice,
        image: getStrapiMedia(attrs.image?.url) || "/oil-product.png",
        images: attrs.images?.map((img: StrapiImage) => getStrapiMedia(img.url)).filter(Boolean) as string[] | undefined,
        description: attrs.description,
        inStock: attrs.inStock ?? true,
        stock: attrs.stock,
        isUniversal: attrs.isUniversal,
        category: attrs.category?.slug || "all",
        rating: attrs.rating as number,
        isNew: attrs.isNew as boolean,
        isHit: attrs.isHit as boolean,
        country: attrs.country as string,
        productAttributes: mappedAttrs,
        relatedProducts: attrs.relatedProducts?.map((p: StrapiProduct) => mapStrapiProduct(p)),
    };
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
    availableAttributes?: StrapiAttribute[];
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
            populate: { 
                filters: true, 
                image: true,
                availableAttributes: true 
            }
        });
        if (!data?.data || data.data.length === 0) return null;
        return data.data[0];
    } catch (error) {
        console.error(`Failed to fetch category ${slug}:`, error);
        return null;
    }
}


export async function getHomepageCategories(): Promise<{ 
    categories: StrapiCategory[], 
    allProductsImage?: string,
    globalFilterOrder?: string[]
}> {
    try {
        const data = await fetchAPI("/homepage", {
            populate: {
                featuredCategories: {
                    populate: {
                        image: true
                    }
                },
                allProductsImage: true,
                globalFilterOrder: {
                    populate: true
                }
            }
        }, { next: { revalidate: 0 } });

        const attrs = data?.data?.attributes || data?.data || {};
        const categories = attrs.featuredCategories || [];
        const allProductsImage = attrs.allProductsImage?.url ? getStrapiMedia(attrs.allProductsImage.url) as string : undefined;
        const globalFilterOrder = attrs.globalFilterOrder?.map((a: any) => a.slug).filter(Boolean) || [];

        return { 
            categories, 
            allProductsImage,
            globalFilterOrder
        };
    } catch (error) {
        console.warn("Failed to fetch homepage categories, falling back to all categories:", error);
        const allCats = await getCategories();
        return { categories: allCats };
    }
}

export async function getCheckoutSettings(): Promise<CheckoutSettings> {
    try {
        const data = await fetchAPI("/checkout-setting", {
            publicationState: "preview"
        });
        
        // If no settings found or API error, return all enabled as fallback
        if (!data?.data) {
            return {
                pickupEnabled: true,
                cityDeliveryEnabled: true,
                shippingEnabled: true
            };
        }

        const attrs = data.data.attributes || data.data;

        return {
            pickupEnabled: attrs.pickupEnabled ?? true,
            cityDeliveryEnabled: attrs.cityDeliveryEnabled ?? true,
            shippingEnabled: attrs.shippingEnabled ?? true
        };
    } catch (error) {
        console.warn("Failed to fetch checkout settings, using defaults:", error);
        return {
            pickupEnabled: true,
            cityDeliveryEnabled: true,
            shippingEnabled: true
        };
    }
}

export async function getHomepageProducts(): Promise<ProductData[]> {
    try {
        const data = await fetchAPI("/homepage", {
            populate: {
                featuredProducts: {
                    populate: {
                        image: true,
                        category: true,
                        productAttributes: {
                            populate: { attribute: true }
                        }
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
            populate: {
                image: true,
                category: true,
                productAttributes: {
                    populate: { attribute: true }
                }
            },
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
        const coreFields = ['brand', 'country'];
        const response = await fetchAPI("/products", {
            filters,
            pagination: { pageSize: 100 }, // Fetch more for better aggregation
            populate: { 
                productAttributes: {
                    populate: { attribute: true }
                } 
            }
        });

        if (!response?.data || response.data.length === 0) {
            return manualFilters.length > 0 ? manualFilters : [];
        }

        const products = response.data as StrapiProduct[];

        // A map to store options for each relevant slug
        const aggregatedOptions: Record<string, Set<string>> = {};
        const coreNames: Record<string, string> = {
            brand: 'Бренд',
            country: 'Страна'
        };

        // If manual filters exist, only aggregate for those
        const targetSlugs = manualFilters.map(f => f.slug);
        targetSlugs.forEach(slug => aggregatedOptions[slug] = new Set());
        
        // If no manual filters, we will discover dynamic filters on the fly
        const autoSlugs = new Set<string>(coreFields);

        products.forEach(p => {
            const attrs = (p as unknown as { attributes: StrapiProduct }).attributes || p;
            
            // Check core fields
            coreFields.forEach(field => {
                if (attrs[field] && typeof attrs[field] === 'string') {
                    if (targetSlugs.length === 0 || targetSlugs.includes(field)) {
                        if (!aggregatedOptions[field]) aggregatedOptions[field] = new Set();
                        aggregatedOptions[field].add(attrs[field] as string);
                    }
                }
            });

            // Check dynamic productAttributes
            const rawAttrs = attrs.productAttributes || [];
            rawAttrs.forEach((pa: StrapiProductAttribute) => {
                if (pa.isFilter && pa.value) {
                    const attrData = (pa.attribute as unknown as { data?: { attributes?: StrapiAttribute } })?.data?.attributes 
                                  || (pa.attribute as unknown as { attributes?: StrapiAttribute })?.attributes 
                                  || pa.attribute;
                    const slug = attrData?.slug;
                    const name = attrData?.name;
                    
                    if (slug && name && (targetSlugs.length === 0 || targetSlugs.includes(slug))) {
                        if (!aggregatedOptions[slug]) aggregatedOptions[slug] = new Set();
                        coreNames[slug] = name; // Save name for auto filters
                        autoSlugs.add(slug);

                        pa.value.split(',').map(s => s.trim()).filter(Boolean).forEach(v => {
                            aggregatedOptions[slug].add(v);
                        });
                    }
                }
            });
        });

        // 3. Construct final filters
        let finalFilters: StrapiFilter[] = [];

        if (manualFilters.length > 0) {
            finalFilters = manualFilters.map(f => ({
                ...f,
                options: Array.from(aggregatedOptions[f.slug] || []).sort()
            })).filter(f => f.options && f.options.length > 0);
        } else {
            // Construct auto-logic
            Array.from(autoSlugs).forEach(field => {
                const options = Array.from(aggregatedOptions[field] || []).sort();
                if (options.length > 0) {
                    finalFilters.push({
                        id: Math.random(), // transient id
                        name: coreNames[field] || field,
                        slug: field,
                        type: 'chips',
                        options
                    });
                }
            });
        }

        // 4. Determine Sort Order
        let sortOrderSlugs: string[] = [];
        if (categorySlug && categorySlug !== "all") {
            const cat = await getCategoryBySlug(categorySlug);
            sortOrderSlugs = cat?.availableAttributes?.map((a: any) => a.slug).filter(Boolean) || [];
        } else {
            const home = await getHomepageCategories();
            sortOrderSlugs = home.globalFilterOrder || [];
        }

        // 5. Apply Sorting
        if (sortOrderSlugs.length > 0) {
            finalFilters.sort((a, b) => {
                const indexA = sortOrderSlugs.indexOf(a.slug);
                const indexB = sortOrderSlugs.indexOf(b.slug);
                
                // If both are in the sort list, use their positions
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                // If only A is in the list, it comes first
                if (indexA !== -1) return -1;
                // If only B is in the list, it comes first
                if (indexB !== -1) return 1;
                // Otherwise, keep original order (or alphabetical)
                return a.name.localeCompare(b.name);
            });
        }

        return finalFilters;

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
                productAttributes: {
                    populate: { attribute: true }
                },
                relatedProducts: {
                    populate: {
                        image: true,
                        category: true,
                        productAttributes: {
                            populate: { attribute: true }
                        }
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

// --- Footer ---

export interface FooterLink {
    id: number;
    label: string;
    href: string;
}

export interface FooterSection {
    id: number;
    title: string;
    links: FooterLink[];
}

export interface FooterData {
    phone: string;
    siteName: string;
    siteTabTitle?: string;
    phoneDescription: string;
    telegramUrl: string;
    vkUrl: string;
    faviconUrl?: string;
    sections: FooterSection[];
    copyrightText: string;
}

export async function getFooterData(): Promise<FooterData | null> {
    try {
        const data = await fetchAPI("/footer", {
            populate: {
                favicon: true,
                sections: {
                    populate: {
                        links: true
                    }
                }
            },
            publicationState: "preview"
        }, { next: { revalidate: 0 } });
        
        if (!data?.data) return null;

        const footer = data.data as FooterData & { favicon?: { url: string } };
        return {
            ...footer,
            faviconUrl: footer.favicon?.url ? getStrapiMedia(footer.favicon.url) as string : undefined,
            telegramUrl: formatSocialUrl(footer.telegramUrl, 'telegram'),
            vkUrl: formatSocialUrl(footer.vkUrl, 'vk')
        };
    } catch (error) {
        console.error("Failed to fetch footer data:", error);
        return null;
    }
}
 
export interface WebsiteSettings {
    siteName: string;
    faviconUrl?: string;
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
    try {
        const footer = await getFooterData();
        
        return {
            siteName: footer?.siteTabTitle || footer?.siteName || "OilMate",
            faviconUrl: footer?.faviconUrl || "/favicon.ico"
        };
    } catch (error) {
        console.warn("Failed to fetch site settings, using defaults:", error);
        return { siteName: "OilMate", faviconUrl: "/favicon.ico" };
    }
}

export async function getTransportCompanies(): Promise<StrapiTransportCompany[]> {
    try {
        const data = await fetchAPI("/transport-companies", {
            sort: "name:asc"
        }, { next: { revalidate: 60 } });
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch transport companies:", error);
        return [];
    }
}


