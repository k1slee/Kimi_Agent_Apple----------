import { authRouter } from "./auth-router";
import { catalogRouter } from "./catalogRouter";
import { cartRouter } from "./cartRouter";
import { favoritesRouter } from "./favoritesRouter";
import { ordersRouter } from "./ordersRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  catalog: catalogRouter,
  cart: cartRouter,
  favorites: favoritesRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
