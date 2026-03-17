import { StaticImageData } from 'next/image';

const oilProductImage = "/oil-product.png";

export interface ProductData {
  id: number | string;
  documentId?: string;
  sku?: string;
  label?: string;
  supplierName?: string;
  supplierDescription?: string;
  supplierLogo?: string | StaticImageData;
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string | StaticImageData;
  images?: string[];
  description?: string;
  inStock: boolean;
  stock?: number;
  oilType: string;
  isUniversal?: boolean;
  category: string;
  viscosity?: string;
  approvals?: string;
  specification?: string;
  viscosityClass?: string;
  application?: string;
  standard?: string;
  color?: string;
  type?: string;
  rating?: number;
  isNew?: boolean;
  isHit?: boolean;
  country?: string;
  characteristics?: {
    id: number;
    key: string;
    value: string;
  }[];
}

export const allProducts: ProductData[] = [
  {
    id: 1,
    documentId: 'o4i9ovouhkd9hg7n6y5l2sgn',
    name: "Shell Helix Ultra 5W-40 синтетическое",
    brand: "Shell",
    volume: "4 л",
    price: 3299,
    oldPrice: 3899,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
    viscosity: "5W-40",
    approvals: "MB 229.5",
  },
  {
    id: 2,
    documentId: 'rm19rnrpls04svcj1b9pa0tw',
    name: "Mobil 1 ESP Formula 5W-30 синтетическое",
    brand: "Mobil",
    volume: "4 л",
    price: 4150,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
    viscosity: "5W-30",
    approvals: "ACEA C3",
  },
  {
    id: 3,
    documentId: 'un83efg2pd5nckm1v27hqp2m',
    name: "Castrol EDGE 5W-30 LL синтетическое",
    brand: "Castrol",
    volume: "4 л",
    price: 3850,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: false,
    category: "motor",
    viscosity: "5W-30",
    approvals: "BMW LL-04",
  },
  {
    id: 4,
    name: "Лукойл Genesis Armortech 5W-40",
    documentId: 'acshi1drevbe64gkmvkrxeau',
    brand: "Лукойл",
    volume: "4 л",
    price: 1890,
    image: oilProductImage,
    inStock: true,
    oilType: "Полусинтетика",
    isUniversal: true,
    category: "motor",
    viscosity: "5W-40",
    approvals: "API SN",
  },
  {
    id: 5,
    name: "Total Quartz INEO ECS 5W-30",
    documentId: 'm4pooi13rw05uobxded1cmxh',
    brand: "Total",
    volume: "5 л",
    price: 4299,
    oldPrice: 4799,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
    viscosity: "5W-30",
    approvals: "ACEA C3",
  },
  {
    id: 6,
    documentId: 'f7rllxdiefx446ov4fj48vbr',
    name: "Mannol Extra Getriebeoel 75W-90",
    brand: "Mannol",
    volume: "1 л",
    price: 890,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "transmission",
    viscosity: "75W-90",
    specification: "GL-5",
  },
  {
    id: 7,
    documentId: 'gmqi61qyd3bor4myjxbx7haw',
    name: "Liqui Moly Hypoid GL5 75W-90",
    brand: "Liqui Moly",
    volume: "1 л",
    price: 1250,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "transmission",
    viscosity: "75W-90",
    specification: "GL-5",
  },
  {
    id: 8,
    documentId: 'k8f4thpocvuo45ae7re0f4dh',
    name: "Shell Spirax S6 AXME 75W-90",
    brand: "Shell",
    volume: "1 л",
    price: 1490,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: false,
    category: "transmission",
    viscosity: "75W-90",
    specification: "GL-4",
  },
  {
    id: 9,
    documentId: 'pje5u2p94of5wyf3ivufa12h',
    name: "Mobil ATF 3309",
    brand: "Mobil",
    volume: "1 л",
    price: 780,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "hydraulic",
    viscosityClass: "HLP 46",
  },
  {
    id: 10,
    documentId: 'lhjr56mc91tazcxr9w6u5etm',
    name: "Fuchs Renolin B 46 HVI",
    brand: "Fuchs",
    volume: "20 л",
    price: 8900,
    image: oilProductImage,
    inStock: true,
    oilType: "Минеральное",
    isUniversal: true,
    category: "industrial",
    application: "Компрессорное",
  },
  {
    id: 11,
    documentId: 'jjyoo65ld0nisf3l3cwalcbi',
    name: "Felix Prolonger G12+ красный",
    brand: "Felix",
    volume: "5 л",
    price: 690,
    image: oilProductImage,
    inStock: true,
    oilType: "Готовый",
    isUniversal: true,
    category: "antifreeze",
    type: "Готовый",
    standard: "G12+",
    color: "Красный",
  },
  {
    id: 12,
    documentId: 'a0mm5ovd489s5lx6ixae084x',
    name: "Sintec Antifreeze Ultra G11 зеленый",
    brand: "Sintec",
    volume: "5 л",
    price: 590,
    oldPrice: 750,
    image: oilProductImage,
    inStock: true,
    oilType: "Готовый",
    isUniversal: true,
    category: "antifreeze",
    type: "Готовый",
    standard: "G11",
    color: "Зеленый",
  },
  {
    id: 13,
    documentId: 'ss2o599ztwxxphfnn4f3e8z3',
    name: "Liqui Moly LM 47 Langzeitfett + MoS2",
    brand: "Liqui Moly",
    volume: "400 г",
    price: 890,
    image: oilProductImage,
    inStock: true,
    oilType: "Пластичная",
    isUniversal: true,
    category: "lubricants",
    application: "Универсальная",
  },
  {
    id: 14,
    documentId: 'z5cv8fvzqc4hjn3kjk37fsn6',
    name: "Shell Argina S3 40",
    brand: "Shell",
    volume: "20 л",
    price: 12500,
    image: oilProductImage,
    inStock: true,
    oilType: "Минеральное",
    isUniversal: false,
    category: "marine",
    viscosity: "SAE 40",
    application: "Судовые дизели",
  },
];

export const categoryNames: Record<string, string> = {
  motor: "Моторные масла",
  transmission: "Трансмиссионные масла",
  hydraulic: "Гидравлические масла",
  industrial: "Индустриальные масла",
  lubricants: "Смазки",
  antifreeze: "Антифризы",
  marine: "Судовые масла",
  all: "Все товары",
  promo: "Все акции",
  new: "Новинки",
};

export function searchProducts(query: string): ProductData[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  return allProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.oilType.toLowerCase().includes(lowerQuery) ||
    (product.viscosity && product.viscosity.toLowerCase().includes(lowerQuery)) ||
    (product.approvals && product.approvals.toLowerCase().includes(lowerQuery))
  ).slice(0, 6); // Limit to 6 results
}
