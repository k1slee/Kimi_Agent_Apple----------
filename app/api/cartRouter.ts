import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cartItems, products } from "@db/schema";

async function getCartWithProducts(userId: number) {
  const db = getDb();
  const rows = await db
    .select({
      id: cartItems.id,
      qty: cartItems.qty,
      variant: cartItems.variant,
      productId: products.id,
      slug: products.slug,
      name: products.name,
      category: products.category,
      image: products.image,
      price: products.price,
      oldPrice: products.oldPrice,
      inStock: products.inStock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(cartItems.id);
  return rows;
}

export const cartRouter = createRouter({
  list: authedQuery.query(({ ctx }) => getCartWithProducts(ctx.user.id)),

  count: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [row] = await db
      .select({ total: sql<number>`coalesce(sum(${cartItems.qty}), 0)` })
      .from(cartItems)
      .where(eq(cartItems.userId, ctx.user.id));
    return { count: Number(row?.total ?? 0) };
  }),

  add: authedQuery
    .input(
      z.object({
        productId: z.number().int().positive(),
        variant: z.string().max(255).default(""),
        qty: z.number().int().min(1).max(10).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId))
        .limit(1);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Товар не найден" });
      if (!product.inStock) throw new TRPCError({ code: "BAD_REQUEST", message: "Товара нет в наличии" });

      await db
        .insert(cartItems)
        .values({
          userId: ctx.user.id,
          productId: input.productId,
          variant: input.variant,
          qty: input.qty,
        })
        .onDuplicateKeyUpdate({
          set: { qty: sql`least(${cartItems.qty} + ${input.qty}, 10)` },
        });
      return getCartWithProducts(ctx.user.id);
    }),

  setQty: authedQuery
    .input(z.object({ id: z.number().int().positive(), qty: z.number().int().min(0).max(10) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      if (input.qty === 0) {
        await db
          .delete(cartItems)
          .where(and(eq(cartItems.id, input.id), eq(cartItems.userId, ctx.user.id)));
      } else {
        await db
          .update(cartItems)
          .set({ qty: input.qty })
          .where(and(eq(cartItems.id, input.id), eq(cartItems.userId, ctx.user.id)));
      }
      return getCartWithProducts(ctx.user.id);
    }),

  remove: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.id, input.id), eq(cartItems.userId, ctx.user.id)));
      return getCartWithProducts(ctx.user.id);
    }),

  clear: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));
    return { ok: true };
  }),
});
