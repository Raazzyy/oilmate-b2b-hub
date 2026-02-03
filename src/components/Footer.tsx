import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="text-xl font-bold text-accent-foreground">М</span>
              </div>
              <div>
                <div className="font-bold">МаслоОпт</div>
                <div className="text-xs text-primary-foreground/70">B2B снабжение</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Оптовые поставки моторных масел и технических жидкостей по всей России.
              Работаем с 2010 года.
            </p>
          </div>

          {/* For buyers */}
          <div>
            <h3 className="mb-4 font-semibold">Покупателям</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">Каталог товаров</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Доставка и оплата</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Возврат товара</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Сертификаты</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Акции и скидки</a></li>
            </ul>
          </div>

          {/* Cooperation */}
          <div>
            <h3 className="mb-4 font-semibold">Сотрудничество</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">Стать партнёром</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Поставщикам</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Вакансии</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">О компании</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Контакты</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-semibold">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-accent" />
                <div>
                  <a href="tel:+78001234567" className="font-medium hover:text-accent transition-colors">
                    8 (800) 123-45-67
                  </a>
                  <p className="text-xs text-primary-foreground/60">Бесплатно по России</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:info@maslopt.ru" className="hover:text-accent transition-colors">
                  info@maslopt.ru
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">
                  Москва, ул. Складочная, д. 1
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80">Пн-Пт: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 МаслоОпт. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-accent transition-colors">Пользовательское соглашение</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
