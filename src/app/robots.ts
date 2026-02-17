import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: 'https://oilmate-b2b-hub.vercel.app/sitemap.xml', // Replace with actual domain when known
    };
}
