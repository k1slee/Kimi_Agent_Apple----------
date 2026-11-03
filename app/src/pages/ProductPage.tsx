import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, Check, Heart, Minus, Plus, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { CATEGORY_LABELS, LOGIN_PATH } from "@/const";
import { discountPercent, formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: product, isLoading } = trpc.catalog.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug },
  );
  const { data: related } = trpc.catalog.related.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug },
  );

  const [storageIdx, setStorageIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setStorageIdx(0);
    setColorIdx(0);
    setQty(1);
  }, [slug]);

  const { data: favIds } = trpc.favorites.ids.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const isFav = product ? (favIds?.includes(product.id) ?? false) : false;

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.count.invalidate();
      utils.cart.list.invalidate();
      toast.success("Товар добавлен в корзину", {
        action: { label: "Перейти", onClick: () => navigate("/cart") },
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const toggleFav = trpc.favorites.toggle.useMutation({
    onSuccess: (r) => {
      utils.favorites.ids.invalidate();
      utils.favorites.list.invalidate();
      toast.success(r.favorite ? "Добавлено в избранное" : "Убрано из избранного");
    },
  });

  const selectedStorage = product?.storage[storageIdx] ?? product?.storage[0];
  const price = selectedStorage?.price ?? product?.price ?? 0;
  const discount = product ? discountPercent(price, product.oldPrice) : null;

  const variantLabel = useMemo(() => {
    if (!product) return "";
    const parts = [selectedStorage?.label, product.colors[colorIdx]?.name].filter(Boolean);
    return parts.join(" · ");
  }, [product, selectedStorage, colorIdx]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
        <div className="h-4 w-64 animate-pulse bg-muted" />
        <div className="mt-8 grid gap-px border border-border bg-border lg:grid-cols-2">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="bg-background p-8">
            <div className="h-10 w-2/3 animate-pulse bg-muted" />
            <div className="mt-4 h-6 w-1/3 animate-pulse bg-muted" />
            <div className="mt-8 h-12 w-full animate-pulse bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center md:px-8">
        <p className="display-tight text-4xl font-extrabold">Товар не найден</p>
        <p className="mt-3 text-muted-foreground">Возможно, он был снят с продажи.</p>
        <Link
          to="/catalog"
          className="label-micro mt-8 border border-foreground px-4 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!isAuthenticated) return navigate(LOGIN_PATH);
    addToCart.mutate({ productId: product.id, variant: variantLabel, qty });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <nav className="label-micro flex flex-wrap items-center gap-2 text-muted-foreground" aria-label="Хлебные крошки">
        <Link to="/" className="transition-colors hover:text-foreground">Главная</Link>
        <span>/</span>
        <Link to={`/catalog/${product.category}`} className="transition-colors hover:text-foreground">
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-px border border-border bg-border lg:grid-cols-2">
        <div className="relative bg-background">
          <img src={product.image} alt={product.name} className="aspect-square h-full w-full object-cover" />
          {(product.badge || discount) && (
            <span
              className={cn(
                "label-micro absolute left-4 top-4 px-2 py-1",
                discount ? "bg-[#e73b1d] text-white" : "bg-foreground text-background",
              )}
            >
              {discount ? `−${discount}%` : product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col bg-background p-6 sm:p-10">
          <p className="label-micro text-muted-foreground">{CATEGORY_LABELS[product.category]}</p>
          <h1 className="display-tight mt-3 text-4xl font-extrabold sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.tagline}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold">{formatPrice(price)}</span>
            {product.oldPrice && (
              <span className="font-mono text-lg text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="label-micro text-muted-foreground">
                Цвет — {product.colors[colorIdx]?.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColorIdx(i)}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center border transition-colors",
                      i === colorIdx ? "border-foreground" : "border-border hover:border-foreground/50",
                    )}
                    aria-label={c.name}
                    aria-pressed={i === colorIdx}
                  >
                    <span className="h-6 w-6 border border-black/10" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.storage.length > 0 && (
            <div className="mt-8">
              <p className="label-micro text-muted-foreground">Конфигурация</p>
              <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2">
                {product.storage.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setStorageIdx(i)}
                    aria-pressed={i === storageIdx}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                      i === storageIdx
                        ? "bg-foreground text-background"
                        : "bg-background hover:bg-muted",
                    )}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className={cn("font-mono text-xs", i === storageIdx ? "text-background/70" : "text-muted-foreground")}>
                      {formatPrice(s.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Уменьшить количество"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-mono text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((v) => Math.min(10, v + 1))}
                className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
                disabled={qty >= 10}
                aria-label="Увеличить количество"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock || addToCart.isPending}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.inStock ? (
                <>
                  Добавить в корзину <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "Нет в наличии"
              )}
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) return navigate(LOGIN_PATH);
                toggleFav.mutate({ productId: product.id });
              }}
              className={cn(
                "flex h-12 w-12 items-center justify-center border transition-colors",
                isFav ? "border-[#e73b1d]" : "border-border hover:border-foreground",
              )}
              aria-label={isFav ? "Убрать из избранного" : "В избранное"}
              aria-pressed={isFav}
            >
              <Heart className={cn("h-5 w-5", isFav && "fill-[#e73b1d] stroke-[#e73b1d]")} />
            </button>
          </div>

          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
            <div className="flex items-center gap-3 bg-background p-4 text-sm">
              <Truck className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              <span>Доставка завтра или бесплатный самовывоз</span>
            </div>
            <div className="flex items-center gap-3 bg-background p-4 text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              <span>Официальная гарантия 12 месяцев</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="display-tight text-2xl font-extrabold">Описание</h2>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div>
          <h2 className="display-tight text-2xl font-extrabold">Характеристики</h2>
          <dl className="mt-4">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between gap-6 border-t border-border py-3"
              >
                <dt className="shrink-0 text-sm text-muted-foreground">{s.label}</dt>
                <dd className="text-right text-sm font-medium">{s.value}</dd>
              </div>
            ))}
            <div className="border-t border-border" />
          </dl>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="display-tight text-3xl font-extrabold">Похожие товары</h2>
            <Link
              to={`/catalog/${product.category}`}
              className="label-micro inline-flex items-center gap-1 transition-colors hover:text-muted-foreground"
            >
              Ещё {CATEGORY_LABELS[product.category]} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        <Check className="h-3.5 w-3.5" /> Товар проверен перед отправкой и полностью оригинален
      </div>
    </div>
  );
}
