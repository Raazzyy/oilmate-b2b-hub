const Footer = () => {
  return (
    <footer className="bg-card">
      <div className="container py-8 md:py-10">
        <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-3">
          {/* For buyers */}
          <div>
            <h3 className="mb-3 md:mb-4 text-sm md:text-base font-medium text-foreground">Покупателям</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Каталог товаров</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Обратная связь</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Доставка и оплата</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Возврат товара</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Акции и скидки</a></li>
            </ul>
          </div>

          {/* Cooperation */}
          <div>
            <h3 className="mb-3 md:mb-4 text-sm md:text-base font-medium text-foreground">Сотрудничество</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Вакансии</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Франчайзинг</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Поставщикам</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Аренда площадей</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 md:mb-4 text-sm md:text-base font-medium text-foreground">Правовая информация</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Правовая информация</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Пользовательское соглашение</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Оферта о продаже товаров</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Политика обработки данных</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
