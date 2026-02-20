import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/admin/', '/my-account/'],
        },
        sitemap: 'https://oilmate-b2b-hub.vercel.app/sitemap.xml',
    };
}
