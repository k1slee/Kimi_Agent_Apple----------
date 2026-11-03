import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, Menu, Package, Search, ShoppingBag, User as UserIcon } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { CATEGORIES, CATEGORY_LABELS, LOGIN_PATH } from "@/const";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CartBadge() {
  const { isAuthenticated } = useAuth();
  const { data } = trpc.cart.count.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  if (!isAuthenticated || !data || data.count === 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-foreground px-1 font-mono text-[10px] font-semibold text-background">
      {data.count > 99 ? "99" : data.count}
    </span>
  );
}

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <div className="bg-foreground px-4 py-2 text-center">
        <p className="label-micro text-background">
          Бесплатная доставка от 10 000 ₽ · Официальная гарантия Apple
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-11 w-11 items-center justify-center lg:hidden"
                aria-label="Открыть меню"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetTitle className="sr-only">Меню</SheetTitle>
              <div className="border-b border-border p-6">
                <span className="text-xl font-extrabold tracking-tight">ЯБКО.</span>
              </div>
              <nav className="flex flex-col">
                <Link
                  to="/catalog"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border px-6 py-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Весь каталог
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    to={`/catalog/${c}`}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-border px-6 py-4 text-sm transition-colors hover:bg-muted"
                  >
                    {CATEGORY_LABELS[c]}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex flex-col">
                <Link
                  to="/favorites"
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Избранное
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Мои заказы
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-xl font-extrabold tracking-tight" aria-label="Ябко — на главную">
            ЯБКО.
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to={`/catalog/${c}`}
                className="border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Поиск: iPhone, MacBook…"
                  className="h-11 w-40 border-b border-foreground bg-transparent px-2 text-sm outline-none transition-[width] duration-200 placeholder:text-muted-foreground sm:w-56"
                  aria-label="Поиск по каталогу"
                />
                <button type="submit" className="flex h-11 w-11 items-center justify-center" aria-label="Найти">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Поиск"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            <Link to="/favorites" className="hidden h-11 w-11 items-center justify-center sm:flex" aria-label="Избранное">
              <Heart className="h-5 w-5" />
            </Link>

            <Link to="/cart" className="relative flex h-11 w-11 items-center justify-center" aria-label="Корзина">
              <ShoppingBag className="h-5 w-5" />
              <CartBadge />
            </Link>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-11 w-11 items-center justify-center" aria-label="Аккаунт">
                    <UserIcon className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-none">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{user.name || "Пользователь"}</p>
                    {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/orders")} className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" /> Мои заказы
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/favorites")} className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" /> Избранное
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="ml-1 hidden rounded-none sm:inline-flex"
                onClick={() => navigate(LOGIN_PATH)}
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
