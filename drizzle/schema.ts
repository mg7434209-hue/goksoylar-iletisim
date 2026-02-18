import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Phones table - Cep telefonları
 */
export const phones = mysqlTable("phones", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  brand: varchar("brand", { length: 64 }).notNull(),
  price: int("price").notNull(),
  oldPrice: int("oldPrice"),
  image: text("image").notNull(),
  storage: varchar("storage", { length: 32 }).notNull(),
  ram: varchar("ram", { length: 32 }).notNull(),
  screen: varchar("screen", { length: 64 }).notNull(),
  camera: varchar("camera", { length: 128 }).notNull(),
  battery: varchar("battery", { length: 32 }).notNull(),
  color: varchar("color", { length: 64 }).notNull(),
  badge: varchar("badge", { length: 32 }),
  installment: varchar("installment", { length: 32 }),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Phone = typeof phones.$inferSelect;
export type InsertPhone = typeof phones.$inferInsert;

/**
 * Turkcell Packages table - Türkcell paketleri
 */
export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  category: mysqlEnum("category", ["faturali", "faturasiz", "genc"]).notNull(),
  internet: varchar("internet", { length: 32 }).notNull(),
  minutes: varchar("minutes", { length: 32 }).notNull(),
  sms: varchar("sms", { length: 32 }).notNull(),
  price: int("price").notNull(),
  popular: boolean("popular").default(false).notNull(),
  features: text("features"), // JSON string array
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

/**
 * Accessories table - Aksesuarlar
 */
export const accessories = mysqlTable("accessories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  price: int("price").notNull(),
  image: text("image").notNull(),
  brand: varchar("brand", { length: 64 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Accessory = typeof accessories.$inferSelect;
export type InsertAccessory = typeof accessories.$inferInsert;

/**
 * Superbox packages table - Turkcell Superbox paketleri
 */
export const superbox = mysqlTable("superbox", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(), // 5g-hazir, devam, calistir-devam, dijitale-ozel, 4-5g
  speed: varchar("speed", { length: 32 }).notNull(), // 4.5G
  quota: varchar("quota", { length: 32 }).notNull(), // 250 GB, 1 TB, etc.
  commitment: varchar("commitment", { length: 32 }).notNull(), // 12 Ay
  price: int("price").notNull(), // Monthly price in TL
  bonus: varchar("bonus", { length: 128 }), // e.g. "50 GB Hediye"
  bonusDetail: varchar("bonusDetail", { length: 256 }), // e.g. "12 Ay Boyunca Her Ay Hediye"
  isOnlineExclusive: boolean("isOnlineExclusive").default(false).notNull(),
  popular: boolean("popular").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Superbox = typeof superbox.$inferSelect;
export type InsertSuperbox = typeof superbox.$inferInsert;
