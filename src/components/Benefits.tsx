import { Truck, Shield, CreditCard, Headphones, Package, Clock } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Бесплатная доставка",
    description: "По всей России при заказе от 50 000 ₽",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Только сертифицированная продукция от официальных дилеров",
  },
  {
    icon: CreditCard,
    title: "Удобная оплата",
    description: "Безналичный расчёт, отсрочка платежа для постоянных клиентов",
  },
  {
    icon: Headphones,
    title: "Персональный менеджер",
    description: "Индивидуальный подход к каждому клиенту",
  },
  {
    icon: Package,
    title: "Широкий ассортимент",
    description: "Более 5000 позиций от ведущих мировых брендов",
  },
  {
    icon: Clock,
    title: "Быстрая обработка",
    description: "Отгрузка в день заказа при наличии товара на складе",
  },
];

const Benefits = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
          Почему выбирают нас
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <benefit.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
