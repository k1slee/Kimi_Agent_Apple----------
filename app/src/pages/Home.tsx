import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { CATEGORIES, CATEGORY_LABELS } from "@/const";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";

export default function Home() {
  const { data: products, isLoading } = trpc.catalog.list.useQuery({ limit: 60 });
  const { data: categories } = trpc.catalog.categories.useQuery();

  const hits = products?.filter((p) => p.badge === "Хит") ?? [];
  const fresh = products?.filter((p) => p.badge === "Новинка" || p.badge === "Выгода").slice(0, 8) ?? [];
  const featured = products?.slice(0, 8) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-14 md:px-8 lg:py-24">
            <p className="label-micro text-muted-foreground">Интернет-магазин техники Apple</p>
            <h1 className="display-tight mt-6 text-[13vw] font-extrabold sm:text-7xl lg:text-[5.5rem]">
              Техника,
              <br />
              которой
              <br />
              доверяют.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Оригинальные iPhone, Mac, iPad, Watch и AirPods с официальной гарантией.
              Бесплатная доставка от 10 000 ₽ по всей России.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
              >
                Смотреть каталог <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/catalog/iphone"
                className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                Выбрать iPhone
              </Link>
            </div>
            <div className="mt-12 flex gap-8">
              {[
                ["15+", "моделей в наличии"],
                ["1 день", "доставка по городу"],
                ["12 мес", "официальной гарантии"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-mono text-xl font-semibold">{v}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border lg:border-l lg:border-t-0">
            <img
              src="/products/hero.jpg"
              alt="Устройства Apple: MacBook, iPad, iPhone и Apple Watch"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
          <div className="flex items-end justify-between">
            <h2 className="display-tight text-3xl font-extrabold sm:text-4xl">Каталог</h2>
            <Link
              to="/catalog"
              className="label-micro inline-flex items-center gap-1 transition-colors hover:text-muted-foreground"
            >
              Все товары <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => {
              const count = categories?.find((x) => x.category === c)?.count ?? 0;
              return (
                <Link
                  key={c}
                  to={`/catalog/${c}`}
                  className="group flex flex-col justify-between bg-background p-5 transition-colors hover:bg-foreground"
                >
                  <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-background/60">
                    {count} {count === 1 ? "товар" : count < 5 ? "товара" : "товаров"}
                  </span>
                  <span className="mt-10 flex items-center justify-between text-lg font-semibold transition-colors group-hover:text-background">
                    {CATEGORY_LABELS[c]}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hits */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
          <div className="flex items-end justify-between">
            <h2 className="display-tight text-3xl font-extrabold sm:text-4xl">Хиты продаж</h2>
            <Link
              to="/catalog"
              className="label-micro inline-flex items-center gap-1 transition-colors hover:text-muted-foreground"
            >
              Весь каталог <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : (hits.length > 0 ? hits : featured).slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-4 py-16 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-micro text-background/50">Трейд-ин</p>
            <h2 className="display-tight mt-4 max-w-2xl text-4xl font-extrabold sm:text-5xl">
              Старый iPhone — в зачёт нового.
            </h2>
            <p className="mt-4 max-w-lg text-background/70">
              Принимаем технику любого года выпуска. Оценим устройство за 15 минут
              и вычтем его стоимость из цены нового.
            </p>
          </div>
          <Link
            to="/catalog/iphone"
            className="inline-flex h-12 items-center gap-2 bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-background/85"
          >
            Подобрать новый <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Fresh */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
          <h2 className="display-tight text-3xl font-extrabold sm:text-4xl">Новинки и выгодные цены</h2>
          <div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : fresh.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {[
              ["Доставка", "По городу — за день, по России — 2–5 дней. Бесплатно от 10 000 ₽."],
              ["Гарантия", "12 месяцев официальной гарантии Apple на всю технику."],
              ["Возврат", "14 дней на обмен или возврат без объяснения причин."],
            ].map(([t, d]) => (
              <div key={t} className="bg-background p-6">
                <p className="font-semibold">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
