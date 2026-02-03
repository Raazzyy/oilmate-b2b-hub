import { Car, Cog, Droplets, Factory, Snowflake, Package } from "lucide-react";

const categories = [
  {
    icon: Car,
    title: "Моторные масла",
    count: "1 250",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Cog,
    title: "Трансмиссионные",
    count: "420",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: Droplets,
    title: "Гидравлические",
    count: "380",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: Factory,
    title: "Индустриальные",
    count: "290",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Snowflake,
    title: "Антифризы",
    count: "180",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Package,
    title: "Смазки",
    count: "340",
    gradient: "from-rose-500 to-rose-600",
  },
];

const Categories = () => {
  return (
    <section className="py-8">
      <div className="container">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Категории товаров
        </h2>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="group flex flex-col items-center rounded-2xl bg-card border border-border p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} transition-transform group-hover:scale-110`}
              >
                <category.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{category.title}</h3>
              <p className="text-xs text-muted-foreground">{category.count} товаров</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
