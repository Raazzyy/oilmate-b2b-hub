import { Percent, Sparkles, Car, Cog, Droplets, Factory, Snowflake, LayoutGrid } from "lucide-react";

const categories = [
  {
    icon: Percent,
    title: "Все акции",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "Новинки",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Car,
    title: "Моторные масла",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  {
    icon: Cog,
    title: "Трансмиссионные",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  {
    icon: Droplets,
    title: "Гидравлические",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  {
    icon: Factory,
    title: "Индустриальные",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  {
    icon: Snowflake,
    title: "Антифризы",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  {
    icon: LayoutGrid,
    title: "Все товары",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
];

const Categories = () => {
  return (
    <section className="py-6">
      <div className="container">
        <div className="flex items-center justify-center gap-6 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="group flex flex-col items-center text-center shrink-0"
            >
              <div
                className={`mb-3 flex h-20 w-20 items-center justify-center rounded-2xl ${category.bgColor} transition-all group-hover:shadow-md group-hover:scale-105`}
              >
                <category.icon className={`h-9 w-9 ${category.color}`} />
              </div>
              <span className="text-sm text-foreground max-w-[90px] leading-tight">{category.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
