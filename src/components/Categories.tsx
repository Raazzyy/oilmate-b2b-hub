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
        {/* Mobile: horizontal scroll, Desktop: even grid */}
        <div className="flex md:grid md:grid-cols-7 gap-4 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.href}
              className="group flex flex-col items-center text-center shrink-0 w-[72px] md:w-auto"
            >
              <div
                className={`mb-2 md:mb-3 flex h-16 w-16 md:h-[72px] md:w-[72px] items-center justify-center rounded-2xl ${category.bgColor} transition-all group-hover:scale-105`}
              >
                <category.icon className={`h-7 w-7 md:h-8 md:w-8 ${category.color}`} strokeWidth={1.5} />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground leading-tight text-center w-full">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;