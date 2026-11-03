import {
  mysqlTable,
  mysqlEnum,
  serial,
  bigint,
  int,
  boolean,
  varchar,
  text,
  json,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ---------- Catalog ----------

export const CATEGORIES = [
  "iphone",
  "mac",
  "ipad",
  "watch",
  "airpods",
  "accessories",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type ProductColor = { name: string; hex: string };
export type ProductStorage = { label: string; price: number };
export type ProductSpec = { label: string; value: string };

export const products = mysqlTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    category: mysqlEnum("category", CATEGORIES).notNull(),
    tagline: varchar("tagline", { length: 255 }).notNull().default(""),
    description: text("description").notNull(),
    price: int("price").notNull(), // в рублях
    oldPrice: int("oldPrice"),
    image: varchar("image", { length: 512 }).notNull(),
    badge: varchar("badge", { length: 32 }), // "Новинка" | "Хит" | "Выгода"
    colors: json("colors").$type<ProductColor[]>().notNull(),
    storage: json("storage").$type<ProductStorage[]>().notNull(),
    specs: json("specs").$type<ProductSpec[]>().notNull(),
    inStock: boolean("inStock").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("category_idx").on(table.category),
  }),
);

export type Product = typeof products.$inferSelect;

// ---------- Cart ----------

export const cartItems = mysqlTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
    variant: varchar("variant", { length: 255 }).notNull().default(""),
    qty: int("qty").notNull().default(1),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userProductVariant: uniqueIndex("user_product_variant").on(
      table.userId,
      table.productId,
      table.variant,
    ),
  }),
);

export type CartItem = typeof cartItems.$inferSelect;

// ---------- Favorites ----------

export const favorites = mysqlTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userProduct: uniqueIndex("fav_user_product").on(
      table.userId,
      table.productId,
    ),
  }),
);

export type Favorite = typeof favorites.$inferSelect;

// ---------- Orders ----------

export const ORDER_STATUSES = [
  "new",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orders = mysqlTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    status: mysqlEnum("status", ORDER_STATUSES).notNull().default("new"),
    total: int("total").notNull(),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 64 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    city: varchar("city", { length: 128 }).notNull(),
    address: varchar("address", { length: 512 }).notNull().default(""),
    delivery: mysqlEnum("delivery", ["courier", "pickup"]).notNull(),
    payment: mysqlEnum("payment", ["card", "cash"]).notNull(),
    comment: text("comment"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("order_user_idx").on(table.userId),
  }),
);

export type Order = typeof orders.$inferSelect;

export const orderItems = mysqlTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
    productId: bigint("productId", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 255 }).notNull(),
    variant: varchar("variant", { length: 255 }).notNull().default(""),
    image: varchar("image", { length: 512 }).notNull().default(""),
    price: int("price").notNull(),
    qty: int("qty").notNull(),
  },
  (table) => ({
    orderIdx: index("order_item_order_idx").on(table.orderId),
  }),
);

export type OrderItem = typeof orderItems.$inferSelect;
