import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { SearchX } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { CATEGORIES, CATEGORY_LABELS } from "@/const";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

type Category = (typeof CATEGORIES)[number];
type Sort = "popular" | "price_asc" | "price_desc" | "newest";

const SORT_LABELS: Record<Sort, string> = {
  popular: "Сначала популярные",
  price_asc: "Цена: по возрастанию",
  price_desc: "Цена: по убыванию",
  newest: "Сначала новые",
};

export default function Catalog() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(q);
  const [sort, setSort] = useState<Sort>("popular");

  const validCategory = CATEGORIES.includes(category as Category)
    ? (category as Category)
    : undefined;

  const { data: products, isLoading } = trpc.catalog.list.useQuery({
    category: validCategory,
    search: q || undefined,
    sort,
    limit: 60,
  });

  const title = validCategory
    ? CATEGORY_LABELS[validCategory]
    : q
      ? `Поиск: «${q}»`
      : "Весь каталог";

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = searchInput.trim();
    setSearchParams(v ? { q: v } : {});
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-micro text-muted-foreground">
            {products ? `${products.length} товаров` : "Загрузка…"}
          </p>
          <h1 className="display-tight mt-2 text-4xl font-extrabold sm:text-5xl">{title}</h1>
        </div>
        <form onSubmit={submitSearch} className="flex w-full max-w-xs items-center border border-foreground">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск по каталогу"
            className="h-11 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Поиск по каталогу"
          />
          <button
            type="submit"
            className="label-micro h-11 shrink-0 bg-foreground px-4 text-background transition-colors hover:bg-foreground/85"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/catalog"
            className={cn(
              "label-micro border px-3 py-2 transition-colors",
              !validCategory
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground",
            )}
          >
            Все
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/catalog/${c}`}
              className={cn(
                "label-micro border px-3 py-2 transition-colors",
                validCategory === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground",
              )}
            >
              {CATEGORY_LABELS[c]}
            </Link>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="label-micro text-muted-foreground">Сортировка</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-11 cursor-pointer border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
            aria-label="Сортировка"
          >
            {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center border border-border py-24 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
            <p className="display-tight mt-6 text-3xl font-extrabold">Ничего не найдено</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              По запросу «{q}» товаров нет. Попробуйте изменить запрос или посмотрите весь каталог.
            </p>
            <button
              onClick={() => {
                setSearchInput("");
                setSearchParams({});
              }}
              className="label-micro mt-6 border border-foreground px-4 py-3 transition-colors hover:bg-foreground hover:text-background"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
