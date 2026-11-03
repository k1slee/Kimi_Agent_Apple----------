import { Link } from "react-router";
import { Heart } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { RequireAuth } from "@/components/RequireAuth";
import { ProductCard } from "@/components/ProductCard";

function FavoritesContent() {
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery();

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center border border-border py-24 text-center">
        <Heart className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="display-tight mt-6 text-3xl font-extrabold">В избранном пусто</p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Нажимайте на сердечко в карточке товара, чтобы сохранить его сюда.
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
    <div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border min-[480px]:grid-cols-2 lg:grid-cols-4">
      {favorites.map((f) => (
        <ProductCard key={f.product.id} product={f.product} />
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <RequireAuth title="Избранное">
        <p className="label-micro text-muted-foreground">Личный кабинет</p>
        <h1 className="display-tight mt-2 text-4xl font-extrabold sm:text-5xl">Избранное</h1>
        <FavoritesContent />
      </RequireAuth>
    </div>
  );
}
