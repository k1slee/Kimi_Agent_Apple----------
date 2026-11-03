import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import { DELIVERY_COST, FREE_DELIVERY_FROM } from "@/const";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, string>;

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="label-micro text-muted-foreground">{label}</span>
      <input
        {...props}
        className={cn(
          "mt-2 h-12 w-full border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground",
          error ? "border-[#e73b1d]" : "border-border",
        )}
      />
      {error && <span className="mt-1 block text-xs text-[#e73b1d]">{error}</span>}
    </label>
  );
}

function CheckoutContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.cart.list.useQuery();

  const [form, setForm] = useState({
    customerName: user?.name ?? "",
    phone: "",
    email: user?.email ?? "",
    city: "",
    address: "",
    delivery: "courier" as "courier" | "pickup",
    payment: "card" as "card" | "cash",
    comment: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [placed, setPlaced] = useState<{ orderId: number; total: number } | null>(null);

  const create = trpc.orders.create.useMutation({
    onSuccess: (r) => {
      utils.cart.list.invalidate();
      utils.cart.count.invalidate();
      utils.orders.list.invalidate();
      setPlaced(r);
    },
    onError: (e) => toast.error(e.message),
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (form.customerName.trim().length < 2) next.customerName = "Укажите имя";
    if (!/^[+()\- 0-9]{10,18}$/.test(form.phone.trim())) next.phone = "Некорректный телефон";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Некорректный email";
    if (form.city.trim().length < 2) next.city = "Укажите город";
    if (form.delivery === "courier" && form.address.trim().length < 5)
      next.address = "Укажите адрес доставки";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Проверьте выделенные поля");
      return;
    }
    create.mutate({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      delivery: form.delivery,
      payment: form.payment,
      comment: form.comment.trim() || undefined,
    });
  };

  if (isLoading) {
    return <div className="mt-8 h-64 animate-pulse border border-border bg-muted/30" />;
  }

  if (placed) {
    return (
      <div className="mt-8 flex flex-col items-center border border-border py-20 text-center">
        <CheckCircle2 className="h-12 w-12" strokeWidth={1.5} />
        <p className="label-micro mt-6 text-muted-foreground">Заказ оформлен</p>
        <p className="display-tight mt-3 text-4xl font-extrabold sm:text-5xl">
          № {String(placed.orderId).padStart(6, "0")}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Сумма заказа — <span className="font-mono font-semibold text-foreground">{formatPrice(placed.total)}</span>.
          Менеджер свяжется с вами для подтверждения, а статус можно отслеживать в личном кабинете.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="h-12 bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
          >
            Мои заказы
          </button>
          <Link
            to="/catalog"
            className="inline-flex h-12 items-center border border-foreground px-6 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center border border-border py-24 text-center">
        <p className="display-tight text-3xl font-extrabold">Корзина пуста</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Сначала добавьте товары — потом оформим заказ.
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
  const deliveryCost = form.delivery === "courier" ? (subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_COST) : 0;
  const total = subtotal + deliveryCost;

  return (
    <form onSubmit={submit} className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <div className="grid content-start gap-px border border-border bg-border">
        <div className="bg-background p-6">
          <p className="font-semibold">Контактные данные</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Имя и фамилия"
              value={form.customerName}
              onChange={set("customerName")}
              placeholder="Иван Иванов"
              error={errors.customerName}
              autoComplete="name"
            />
            <Field
              label="Телефон"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+7 900 000-00-00"
              error={errors.phone}
              autoComplete="tel"
              inputMode="tel"
            />
            <Field
              label="Email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
              inputMode="email"
            />
            <Field
              label="Город"
              value={form.city}
              onChange={set("city")}
              placeholder="Москва"
              error={errors.city}
              autoComplete="address-level2"
            />
          </div>
        </div>

        <div className="bg-background p-6">
          <p className="font-semibold">Способ получения</p>
          <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
            {(
              [
                ["courier", "Курьером", `Завтра, ${subtotal >= FREE_DELIVERY_FROM ? "бесплатно" : formatPrice(DELIVERY_COST)}`],
                ["pickup", "Самовывоз", "Сегодня из магазина, бесплатно"],
              ] as const
            ).map(([value, label, hint]) => (
              <button
                type="button"
                key={value}
                onClick={() => setForm((f) => ({ ...f, delivery: value }))}
                aria-pressed={form.delivery === value}
                className={cn(
                  "px-4 py-4 text-left transition-colors",
                  form.delivery === value ? "bg-foreground text-background" : "bg-background hover:bg-muted",
                )}
              >
                <span className="block text-sm font-medium">{label}</span>
                <span className={cn("mt-1 block text-xs", form.delivery === value ? "text-background/70" : "text-muted-foreground")}>
                  {hint}
                </span>
              </button>
            ))}
          </div>
          {form.delivery === "courier" && (
            <div className="mt-5">
              <Field
                label="Адрес доставки"
                value={form.address}
                onChange={set("address")}
                placeholder="Улица, дом, квартира"
                error={errors.address}
                autoComplete="street-address"
              />
            </div>
          )}
        </div>

        <div className="bg-background p-6">
          <p className="font-semibold">Оплата</p>
          <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
            {(
              [
                ["card", "Картой при получении", "Visa, Mastercard, Мир"],
                ["cash", "Наличными", "Курьеру или в магазине"],
              ] as const
            ).map(([value, label, hint]) => (
              <button
                type="button"
                key={value}
                onClick={() => setForm((f) => ({ ...f, payment: value }))}
                aria-pressed={form.payment === value}
                className={cn(
                  "px-4 py-4 text-left transition-colors",
                  form.payment === value ? "bg-foreground text-background" : "bg-background hover:bg-muted",
                )}
              >
                <span className="block text-sm font-medium">{label}</span>
                <span className={cn("mt-1 block text-xs", form.payment === value ? "text-background/70" : "text-muted-foreground")}>
                  {hint}
                </span>
              </button>
            ))}
          </div>
          <label className="mt-5 block">
            <span className="label-micro text-muted-foreground">Комментарий к заказу</span>
            <textarea
              value={form.comment}
              onChange={set("comment")}
              rows={3}
              placeholder="Например: позвонить за час до доставки"
              className="mt-2 w-full resize-none border border-border bg-transparent px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
          </label>
        </div>
      </div>

      <aside className="h-fit border border-border p-6 lg:sticky lg:top-24">
        <p className="label-micro text-muted-foreground">Ваш заказ</p>
        <div className="mt-4 flex flex-col gap-3">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden border border-border">
                <img src={i.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{i.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {i.variant ? `${i.variant} · ` : ""}{i.qty} шт
                </p>
              </div>
              <p className="shrink-0 font-mono text-xs font-semibold">{formatPrice(i.price * i.qty)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span>Товары</span>
            <span className="font-mono font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between text-sm">
            <span>Доставка</span>
            <span className="font-mono font-semibold">
              {deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-semibold">Итого</span>
            <span className="font-mono text-xl font-bold">{formatPrice(total)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={create.isPending}
          className="mt-6 h-12 w-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:opacity-50"
        >
          {create.isPending ? "Оформляем…" : "Подтвердить заказ"}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь с условиями продажи
        </p>
      </aside>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <RequireAuth title="Оформление заказа">
        <p className="label-micro text-muted-foreground">Оформление</p>
        <h1 className="display-tight mt-2 text-4xl font-extrabold sm:text-5xl">Почти готово</h1>
        <CheckoutContent />
      </RequireAuth>
    </div>
  );
}
