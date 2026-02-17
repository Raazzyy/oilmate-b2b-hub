import { MetadataRoute } from 'next';
import { allProducts, categoryNames } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://oilmate-b2b-hub.vercel.app'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/catalog',
        '/promotions',
        '/about',
        '/contacts',
        '/delivery',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Category routes
    const categoryRoutes = Object.keys(categoryNames).map((category) => ({
        url: `${baseUrl}/catalog/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Product routes
    const productRoutes = allProducts.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...categoryRoutes, ...productRoutes];
}
