import { Link, useNavigate } from "react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { RequireAuth } from "@/components/RequireAuth";
import { FREE_DELIVERY_FROM } from "@/const";
import { formatPrice } from "@/lib/format";

function CartContent() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.cart.list.useQuery();

  const setQty = trpc.cart.setQty.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate();
      utils.cart.count.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate();
      utils.cart.count.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-px border border-border bg-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse bg-background" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center border border-border py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="display-tight mt-6 text-3xl font-extrabold">Корзина пуста</p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Добавьте iPhone, Mac или AirPods — и они появятся здесь.
        </p>
        <Link
          to="/catalog"
          className="label-micro mt-6 bg-foreground px-4 py-3 text-background transition-colors hover:bg-foreground/85"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const freeDelivery = subtotal >= FREE_DELIVERY_FROM;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="grid content-start gap-px border border-border bg-border">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-background p-4 sm:gap-6 sm:p-6">
            <Link
              to={`/product/${item.slug}`}
              className="h-24 w-24 shrink-0 overflow-hidden border border-border sm:h-28 sm:w-28"
            >
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/product/${item.slug}`}
                    className="block truncate font-semibold transition-colors hover:text-muted-foreground"
                  >
                    {item.name}
                  </Link>
                  {item.variant && (
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{item.variant}</p>
                  )}
                  {!item.inStock && (
                    <p className="mt-1 font-mono text-xs text-[#e73b1d]">Нет в наличии</p>
                  )}
                </div>
                <p className="shrink-0 font-mono text-sm font-semibold">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQty.mutate({ id: item.id, qty: item.qty - 1 })}
                    className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-muted"
                    aria-label="Уменьшить"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{item.qty}</span>
                  <button
                    onClick={() => setQty.mutate({ id: item.id, qty: item.qty + 1 })}
                    disabled={item.qty >= 10}
                    className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
                    aria-label="Увеличить"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => remove.mutate({ id: item.id })}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-[#e73b1d]"
                  aria-label={`Удалить ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit border border-border p-6 lg:sticky lg:top-24">
        <p className="label-micro text-muted-foreground">Итого</p>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm">Товары ({items.reduce((s, i) => s + i.qty, 0)})</span>
          <span className="font-mono text-sm font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-sm">Доставка</span>
          <span className="font-mono text-sm font-semibold">
            {freeDelivery ? "Бесплатно" : "от 590 ₽"}
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="font-semibold">К оплате</span>
          <span className="font-mono text-xl font-bold">{formatPrice(subtotal)}</span>
        </div>
        {!freeDelivery && (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            До бесплатной доставки не хватает {formatPrice(FREE_DELIVERY_FROM - subtotal)}.
          </p>
        )}
        <button
          onClick={() => navigate("/checkout")}
          className="mt-6 h-12 w-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/85"
        >
          Оформить заказ
        </button>
        <Link
          to="/catalog"
          className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Продолжить покупки
        </Link>
      </aside>
    </div>
  );
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <RequireAuth title="Ваша корзина">
        <p className="label-micro text-muted-foreground">Корзина</p>
        <h1 className="display-tight mt-2 text-4xl font-extrabold sm:text-5xl">Ваш заказ</h1>
        <CartContent />
      </RequireAuth>
    </div>
  );
}
