export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];

    // If src is already a full Cloudinary URL, we need to inject params properly.
    // However, Strapi often stores the full URL in the database.
    // If it's a full URL, we might need to parse it or just append params if it was a raw path.
    // But standard Cloudinary loader expects a relative path or handles full URLs by replacing /upload/ with /upload/params/

    if (src.includes('res.cloudinary.com')) {
        const [base, file] = src.split('/upload/');
        if (file) {
            return `${base}/upload/${params.join(',')}/${file}`;
        }
        return src;
    }

    // If it's a local path or other domain, return as is (fallback)
    return src;
}
