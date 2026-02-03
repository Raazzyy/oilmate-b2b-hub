const brands = [
  { name: "Shell", logo: "🐚" },
  { name: "Mobil", logo: "🔴" },
  { name: "Castrol", logo: "🟢" },
  { name: "Total", logo: "🔵" },
  { name: "Лукойл", logo: "🛢️" },
  { name: "Роснефть", logo: "🇷🇺" },
  { name: "Gazpromneft", logo: "⛽" },
  { name: "Mannol", logo: "🟡" },
];

const Brands = () => {
  return (
    <section className="py-12 bg-card">
      <div className="container">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
          Работаем с ведущими брендами
        </h2>

        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex aspect-square flex-col items-center justify-center rounded-xl bg-muted/50 p-4 transition-all hover:bg-muted hover:shadow-sm"
            >
              <span className="mb-2 text-3xl">{brand.logo}</span>
              <span className="text-xs font-medium text-muted-foreground text-center">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
