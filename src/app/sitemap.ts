import { MetadataRoute } from 'next';
import { getProducts, getCategories, STRAPI_API_URL } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://oilmate-b2b-hub.vercel.app';

    // Static routes
    const routes = [
        '',
        '/catalog',
        '/promotions',
        '/contacts',
        '/delivery',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Fetch all products
    // Note: We might need to handle pagination if there are thousands of products.
    // For now, let's assume we fetch a reasonable amount or use a loop.
    // Strapi fetch with limit -1 or loop.
    // Fetch products safely
    let products = [];
    try {
        const productsResponse = await getProducts({ pagination: { limit: 1000 } });
        products = productsResponse.data.map((product) => ({
            url: `${baseUrl}/product/${product.documentId}`,
            lastModified: new Date(), // Ideally createAt/updatedAt from product
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.warn("Sitemap: Failed to fetch products", error);
    }


    // Categories are a bit trickier because we need to map them to /catalog/[slug]
    // We need to fetch categories.
    // getCategories currently returns Record<string, unknown>[], let's refine it or cast.
    // Assuming getCategories returns array with slug.
    // We might need to update getCategories in strapi.ts to be more typed or robust.
    // For now let's skip dynamic categories in sitemap or rely on static catalog page.
    // Better to include them if possible.

    const categories = await getCategories();
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/catalog/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...products];
}
