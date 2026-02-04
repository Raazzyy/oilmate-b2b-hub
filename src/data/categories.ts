import motorOilImage from "@/assets/categories/motor-oil.jpg";
import transmissionOilImage from "@/assets/categories/transmission-oil.jpg";
import hydraulicOilImage from "@/assets/categories/hydraulic-oil.jpg";
import industrialOilImage from "@/assets/categories/industrial-oil.jpg";
import lubricantsImage from "@/assets/categories/lubricants.jpg";
import antifreezeImage from "@/assets/categories/antifreeze.jpg";
import marineOilImage from "@/assets/categories/marine-oil.jpg";

export interface CategoryData {
  id: string;
  name: string;
  image: string;
}

export const categories: CategoryData[] = [
  { id: "motor", name: "Моторные масла", image: motorOilImage },
  { id: "transmission", name: "Трансмиссионные масла", image: transmissionOilImage },
  { id: "hydraulic", name: "Гидравлические масла", image: hydraulicOilImage },
  { id: "industrial", name: "Индустриальные масла", image: industrialOilImage },
  { id: "lubricants", name: "Смазки", image: lubricantsImage },
  { id: "antifreeze", name: "Антифризы", image: antifreezeImage },
  { id: "marine", name: "Судовые масла", image: marineOilImage },
];

export const getCategoryImage = (categoryId: string): string | undefined => {
  const category = categories.find(c => c.id === categoryId);
  return category?.image;
};
