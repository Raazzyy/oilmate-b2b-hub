export interface HeroSlide {
    id: number;
    title: string;
    href: string;
    gradient: string;
    backgroundImage?: string;
    desktopImage?: string;
}

export interface Promotion {
    id: number;
    title?: string;
    image?: string;
    desktopImage?: string;
    href: string;
}
