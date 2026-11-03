import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";
import { Button } from "@/components/ui/button";

export function RequireAuth({ children, title }: { children: ReactNode; title: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
        <div className="h-8 w-48 animate-pulse bg-muted" />
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          <div className="h-40 animate-pulse bg-background" />
          <div className="h-40 animate-pulse bg-background" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center md:px-8">
        <p className="label-micro text-muted-foreground">Требуется вход</p>
        <h1 className="display-tight mt-4 text-4xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Войдите через Kimi, чтобы увидеть эту страницу. Корзина, избранное и заказы
          привязаны к вашему аккаунту.
        </p>
        <Button
          size="lg"
          className="mt-8 rounded-none px-10"
          onClick={() => navigate(LOGIN_PATH)}
        >
          Войти через Kimi
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
