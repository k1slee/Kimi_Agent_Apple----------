import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { favorites, products } from "@db/schema";

export const favoritesRouter = createRouter({
  ids: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select({ productId: favorites.productId })
      .from(favorites)
      .where(eq(favorites.userId, ctx.user.id));
    return rows.map((r) => r.productId);
  }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select({ product: products, addedAt: favorites.createdAt })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, ctx.user.id))
      .orderBy(favorites.id);
  }),

  toggle: authedQuery
    .input(z.object({ productId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [product] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, input.productId))
        .limit(1);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Товар не найден" });

      const [existing] = await db
        .select()
        .from(favorites)
        .where(
          and(eq(favorites.userId, ctx.user.id), eq(favorites.productId, input.productId)),
        )
        .limit(1);

      if (existing) {
        await db.delete(favorites).where(eq(favorites.id, existing.id));
        return { favorite: false };
      }
      await db
        .insert(favorites)
        .values({ userId: ctx.user.id, productId: input.productId });
      return { favorite: true };
    }),
});
