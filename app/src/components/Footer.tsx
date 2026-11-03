import { Link } from "react-router";
import { CATEGORIES, CATEGORY_LABELS } from "@/const";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <p className="text-xl font-extrabold tracking-tight">ЯБКО.</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Оригинальная техника Apple с официальной гарантией. Доставляем по всей России
            с 2019 года.
          </p>
        </div>
        <div>
          <p className="label-micro text-muted-foreground">Каталог</p>
          <nav className="mt-4 flex flex-col gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to={`/catalog/${c}`}
                className="text-sm transition-colors hover:text-muted-foreground"
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="label-micro text-muted-foreground">Покупателям</p>
          <nav className="mt-4 flex flex-col gap-2">
            <Link to="/cart" className="text-sm transition-colors hover:text-muted-foreground">
              Корзина
            </Link>
            <Link to="/orders" className="text-sm transition-colors hover:text-muted-foreground">
              Мои заказы
            </Link>
            <Link to="/favorites" className="text-sm transition-colors hover:text-muted-foreground">
              Избранное
            </Link>
          </nav>
        </div>
        <div>
          <p className="label-micro text-muted-foreground">Контакты</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href="tel:+78002000600" className="transition-colors hover:text-muted-foreground">
              8 800 200-06-00
            </a>
            <a href="mailto:privet@yabko.ru" className="transition-colors hover:text-muted-foreground">
              privet@yabko.ru
            </a>
            <p className="text-muted-foreground">Ежедневно 9:00–21:00</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between md:px-8">
          <p>© 2026 Ябко. Все права защищены.</p>
          <p>Apple, iPhone, Mac и iPad — товарные знаки Apple Inc.</p>
        </div>
      </div>
    </footer>
  );
}
