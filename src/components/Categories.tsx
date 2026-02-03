import { Percent, Sparkles, Car, Cog, Droplets, Factory, Snowflake, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Percent,
    title: "Все акции",
    color: "text-primary",
    bgColor: "bg-gradient-to-br from-primary/20 to-accent/20",
    href: "/catalog/promo",
  },
  {
    icon: Sparkles,
    title: "Новинки",
    color: "text-accent",
    bgColor: "bg-gradient-to-br from-accent/20 to-primary/10",
    href: "/catalog/new",
  },
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
    <section className="py-6">
      <div className="container">
        <div className="flex items-start justify-between overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.href}
              className="group flex flex-col items-center text-center flex-1 min-w-0"
            >
              <div
                className={`mb-3 flex h-20 w-20 items-center justify-center rounded-2xl ${category.bgColor} transition-all group-hover:scale-105`}
              >
                <category.icon className={`h-9 w-9 ${category.color}`} />
              </div>
              <span className="text-sm text-foreground max-w-[90px] leading-tight">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
