import { Car, Cog, Droplets, Factory, Snowflake, Package } from "lucide-react";

const categories = [
  {
    icon: Car,
    title: "Моторные масла",
    count: "1 250 товаров",
    color: "bg-blue-500",
  },
  {
    icon: Cog,
    title: "Трансмиссионные",
    count: "420 товаров",
    color: "bg-green-500",
  },
  {
    icon: Droplets,
    title: "Гидравлические",
    count: "380 товаров",
    color: "bg-purple-500",
  },
  {
    icon: Factory,
    title: "Индустриальные",
    count: "290 товаров",
    color: "bg-orange-500",
  },
  {
    icon: Snowflake,
    title: "Антифризы",
    count: "180 товаров",
    color: "bg-cyan-500",
  },
  {
    icon: Package,
    title: "Смазки и присадки",
    count: "340 товаров",
    color: "bg-rose-500",
  },
];

const Categories = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
          Категории товаров
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="group flex flex-col items-center rounded-xl bg-card p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${category.color} transition-transform group-hover:scale-110`}
              >
                <category.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{category.title}</h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
