import { Car, Cog, Droplets, Factory, Snowflake, Wrench, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Car,
    title: "Моторные масла",
    color: "text-primary",
    bgColor: "bg-muted hover:bg-primary/10",
    href: "/catalog/motor",
  },
  {
    icon: Cog,
    title: "Трансмиссионные",
    color: "text-primary",
    bgColor: "bg-muted hover:bg-primary/10",
    href: "/catalog/transmission",
  },
  {
    icon: Droplets,
    title: "Гидравлические",
    color: "text-primary",
    bgColor: "bg-muted hover:bg-primary/10",
    href: "/catalog/hydraulic",
  },
  {
    icon: Factory,
    title: "Индустриальные",
    color: "text-primary",
    bgColor: "bg-muted hover:bg-primary/10",
    href: "/catalog/industrial",
  },
  {
    icon: Wrench,
    title: "Смазки",
    color: "text-primary",
    bgColor: "bg-muted hover:bg-primary/10",
    href: "/catalog/lubricants",
  },
  {
    icon: Snowflake,
    title: "Антифризы",
    color: "text-accent",
    bgColor: "bg-muted hover:bg-accent/10",
    href: "/catalog/antifreeze",
  },
  {
    icon: LayoutGrid,
    title: "Все товары",
    color: "text-foreground",
    bgColor: "bg-muted hover:bg-primary/10",
    href: "/catalog/all",
  },
];

const Categories = () => {
  return (
    <section className="py-4 md:py-6">
      <div className="container">
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 md:overflow-visible md:grid md:grid-cols-7 scrollbar-hide">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.href}
              className="group flex flex-col items-center text-center shrink-0 w-20 md:w-auto"
            >
              <div
                className={`mb-2 md:mb-3 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl ${category.bgColor} transition-all group-hover:scale-105`}
              >
                <category.icon className={`h-7 w-7 md:h-9 md:w-9 ${category.color}`} />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground max-w-[80px] md:max-w-[90px] leading-tight">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;