import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Delivery } from "@contracts/constants";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cartItems, orderItems, orders, products } from "@db/schema";

const phoneRe = /^[+()\- 0-9]{10,18}$/;

export const ordersRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        customerName: z.string().trim().min(2, "Укажите имя").max(255),
        phone: z.string().trim().regex(phoneRe, "Некорректный телефон"),
        email: z.string().trim().email("Некорректный email"),
        city: z.string().trim().min(2, "Укажите город").max(128),
        address: z.string().trim().max(512).default(""),
        delivery: z.enum(["courier", "pickup"]),
        payment: z.enum(["card", "cash"]),
        comment: z.string().trim().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      if (input.delivery === "courier" && input.address.trim().length < 5) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Укажите адрес доставки" });
      }

      const cart = await db
        .select({
          qty: cartItems.qty,
          variant: cartItems.variant,
          productId: products.id,
          name: products.name,
          price: products.price,
          image: products.image,
          inStock: products.inStock,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, ctx.user.id));

      if (cart.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Корзина пуста" });
      }
      const unavailable = cart.filter((i) => !i.inStock);
      if (unavailable.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Нет в наличии: ${unavailable.map((i) => i.name).join(", ")}`,
        });
      }

      const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
      const deliveryCost =
        input.delivery === "courier" && subtotal < Delivery.freeCourierFrom
          ? Delivery.courierCost
          : 0;
      const total = subtotal + deliveryCost;

      const orderId = await db.transaction(async (tx) => {
        const [{ id }] = await tx
          .insert(orders)
          .values({
            userId: ctx.user.id,
            total,
            customerName: input.customerName,
            phone: input.phone,
            email: input.email,
            city: input.city,
            address: input.delivery === "courier" ? input.address : "",
            delivery: input.delivery,
            payment: input.payment,
            comment: input.comment || null,
          })
          .$returningId();

        await tx.insert(orderItems).values(
          cart.map((i) => ({
            orderId: id,
            productId: i.productId,
            name: i.name,
            variant: i.variant,
            image: i.image,
            price: i.price,
            qty: i.qty,
          })),
        );
        await tx.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));
        return id;
      });

      return { orderId, total };
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));
    const items = await db
      .select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.userId, ctx.user.id));
    return rows.map((o) => ({
      ...o,
      items: items.filter((i) => i.order_items.orderId === o.id).map((i) => i.order_items),
    }));
  }),

  byId: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Заказ не найден" });
      }
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    }),
});
