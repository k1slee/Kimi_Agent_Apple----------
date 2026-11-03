import { Link } from "react-router";
import { Package } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { RequireAuth } from "@/components/RequireAuth";
import { ORDER_STATUS_LABELS } from "@/const";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function OrdersContent() {
  const { data: orders, isLoading } = trpc.orders.list.useQuery();

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-px border border-border bg-border">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse bg-background" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center border border-border py-24 text-center">
        <Package className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="display-tight mt-6 text-3xl font-extrabold">Заказов пока нет</p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Оформите первый заказ — и его история появится здесь.
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

  return (
    <div className="mt-8 grid content-start gap-px border border-border bg-border">
      {orders.map((order) => (
        <article key={order.id} className="bg-background">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-sm font-bold">
                № {String(order.id).padStart(6, "0")}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "label-micro px-2 py-1",
                  order.status === "cancelled"
                    ? "bg-[#e73b1d] text-white"
                    : order.status === "delivered"
                      ? "border border-foreground"
                      : "bg-foreground text-background",
                )}
              >
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </span>
              <span className="font-mono text-sm font-semibold">{formatPrice(order.total)}</span>
            </div>
          </header>
          <ul>
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 border-t border-border bg-background p-4 first:border-t-0 sm:px-6"
              >
                {item.image && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden border border-border">
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {item.variant ? `${item.variant} · ` : ""}
                    {item.qty} шт × {formatPrice(item.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <footer className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
            <span>{order.delivery === "courier" ? "Доставка курьером" : "Самовывоз"}</span>
            <span>
              {order.city}
              {order.address ? `, ${order.address}` : ""}
            </span>
            <span>{order.payment === "card" ? "Оплата картой" : "Оплата наличными"}</span>
          </footer>
        </article>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <RequireAuth title="Ваши заказы">
        <p className="label-micro text-muted-foreground">Личный кабинет</p>
        <h1 className="display-tight mt-2 text-4xl font-extrabold sm:text-5xl">Мои заказы</h1>
        <OrdersContent />
      </RequireAuth>
    </div>
  );
}
