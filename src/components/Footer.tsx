import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold text-primary-foreground">М</span>
              </div>
              <div>
                <div className="font-bold text-foreground">МаслоОпт</div>
                <div className="text-xs text-muted-foreground">B2B снабжение</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Оптовые поставки моторных масел и технических жидкостей по всей России.
            </p>
          </div>

          {/* For buyers */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Покупателям</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Каталог товаров</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Доставка и оплата</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Возврат товара</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Акции и скидки</a></li>
            </ul>
          </div>

          {/* Cooperation */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Сотрудничество</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Стать партнёром</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Поставщикам</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">О компании</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+78001234567" className="text-muted-foreground hover:text-primary transition-colors">
                  8 (800) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@maslopt.ru" className="text-muted-foreground hover:text-primary transition-colors">
                  info@maslopt.ru
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  Москва, ул. Складочная, д. 1
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 МаслоОпт. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Пользовательское соглашение</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
