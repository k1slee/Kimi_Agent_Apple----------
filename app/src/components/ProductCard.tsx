import { Link, useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { CATEGORY_LABELS, LOGIN_PATH } from "@/const";
import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  inStock: boolean;
  storage: { label: string; price: number }[];
};

export function ProductCard({ product }: { product: CardProduct }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: favIds } = trpc.favorites.ids.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const isFav = favIds?.includes(product.id) ?? false;

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.count.invalidate();
      utils.cart.list.invalidate();
      toast.success(`${product.name} — в корзине`);
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

  const discount = discountPercent(product.price, product.oldPrice);
  const minPrice = Math.min(...product.storage.map((s) => s.price));

  return (
    <div className="group relative flex flex-col bg-background">
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        aria-label={product.name}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.045]"
        />
        {(product.badge || discount) && (
          <span
            className={cn(
              "label-micro absolute left-3 top-3 px-2 py-1",
              discount ? "bg-[#e73b1d] text-white" : "bg-foreground text-background",
            )}
          >
            {discount ? `−${discount}%` : product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="label-micro bg-foreground px-3 py-2 text-background">Нет в наличии</span>
          </span>
        )}
      </Link>

      <button
        onClick={() => {
          if (!isAuthenticated) return navigate(LOGIN_PATH);
          toggleFav.mutate({ productId: product.id });
        }}
        className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center"
        aria-label={isFav ? "Убрать из избранного" : "В избранное"}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isFav ? "fill-[#e73b1d] stroke-[#e73b1d]" : "stroke-foreground hover:stroke-[#e73b1d]",
          )}
        />
      </button>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="label-micro text-muted-foreground">{CATEGORY_LABELS[product.category]}</p>
        <Link
          to={`/product/${product.slug}`}
          className="text-base font-semibold leading-snug outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-foreground"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-sm font-semibold">
              {product.storage.length > 1 ? `от ${formatPrice(minPrice)}` : formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="font-mono text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            disabled={!product.inStock || addToCart.isPending}
            onClick={() => {
              if (!isAuthenticated) return navigate(LOGIN_PATH);
              addToCart.mutate({
                productId: product.id,
                variant: product.storage[0]?.label ?? "",
                qty: 1,
              });
            }}
            className="label-micro border border-foreground px-3 py-2 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-background">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 animate-pulse bg-muted" />
        <div className="h-4 w-32 animate-pulse bg-muted" />
        <div className="mt-2 h-4 w-24 animate-pulse bg-muted" />
      </div>
    </div>
  );
}
