import { Shield, Wallet, Truck } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    iconBg: "bg-blue-500",
    title: "Гарантия качества",
    description: "Только сертифицированная продукция от официальных дилеров",
  },
  {
    icon: Wallet,
    iconBg: "bg-amber-500",
    title: "Вернём деньги",
    description: "Если не устраивает качество товара",
  },
  {
    icon: Truck,
    iconBg: "bg-purple-500",
    title: "Быстрая доставка",
    description: "Отгрузка в день заказа по всей России",
  },
];

const Benefits = () => {
  return (
    <section className="py-8">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-2xl bg-card p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="mb-1 font-bold text-foreground text-lg">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${benefit.iconBg}`}>
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
