import { z } from "zod";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, CATEGORIES } from "@db/schema";

const sortMap = {
  popular: desc(products.id),
  price_asc: asc(products.price),
  price_desc: desc(products.price),
  newest: desc(products.createdAt),
} as const;

export const catalogRouter = createRouter({
  categories: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db
      .select({
        category: products.category,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .groupBy(products.category);
    return CATEGORIES.map((c) => ({
      category: c,
      count: rows.find((r) => r.category === c)?.count ?? 0,
    }));
  }),

  list: publicQuery
    .input(
      z.object({
        category: z.enum(CATEGORIES).optional(),
        search: z.string().trim().max(120).optional(),
        sort: z.enum(["popular", "price_asc", "price_desc", "newest"]).default("popular"),
        limit: z.number().int().min(1).max(100).default(60),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.category) conditions.push(eq(products.category, input.category));
      if (input.search) conditions.push(like(products.name, `%${input.search}%`));
      return db
        .select()
        .from(products)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(sortMap[input.sort])
        .limit(input.limit);
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string().min(1).max(128) }))
    .query(async ({ input }) => {
      const db = getDb();
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug))
        .limit(1);
      return product ?? null;
    }),

  related: publicQuery
    .input(z.object({ slug: z.string().min(1).max(128) }))
    .query(async ({ input }) => {
      const db = getDb();
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug))
        .limit(1);
      if (!product) return [];
      const sameCategory = await db
        .select()
        .from(products)
        .where(and(eq(products.category, product.category), sql`${products.id} != ${product.id}`))
        .orderBy(asc(products.price))
        .limit(4);
      if (sameCategory.length >= 4) return sameCategory;
      const fillers = await db
        .select()
        .from(products)
        .where(
          and(
            sql`${products.category} != ${product.category}`,
            sql`${products.id} != ${product.id}`,
          ),
        )
        .orderBy(desc(products.badge), asc(products.price))
        .limit(4 - sameCategory.length);
      return [...sameCategory, ...fillers];
    }),
});
