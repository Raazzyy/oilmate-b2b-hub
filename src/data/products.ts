import oilProductImage from "@/assets/oil-product.png";

export interface ProductData {
  id: number;
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
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
}

export const allProducts: ProductData[] = [
  {
    id: 1,
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
