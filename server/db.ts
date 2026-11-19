import { eq, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  phones, InsertPhone,
  packages, InsertPackage,
  accessories, InsertAccessory,
  superbox, InsertSuperbox,
  visitStats,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PHONE QUERIES ============

export async function getAllPhones(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(phones).where(eq(phones.isActive, true)).orderBy(asc(phones.sortOrder), desc(phones.createdAt));
  }
  return db.select().from(phones).orderBy(asc(phones.sortOrder), desc(phones.createdAt));
}

export async function getPhoneById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(phones).where(eq(phones.id, id)).limit(1);
  return result[0];
}

export async function createPhone(data: InsertPhone) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(phones).values(data);
  return result[0].insertId;
}

export async function updatePhone(id: number, data: Partial<InsertPhone>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(phones).set(data).where(eq(phones.id, id));
}

export async function deletePhone(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(phones).where(eq(phones.id, id));
}

// ============ PACKAGE QUERIES ============

export async function getAllPackages(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(packages).where(eq(packages.isActive, true)).orderBy(asc(packages.sortOrder), asc(packages.price));
  }
  return db.select().from(packages).orderBy(asc(packages.sortOrder), asc(packages.price));
}

export async function getPackageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  return result[0];
}

export async function createPackage(data: InsertPackage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(packages).values(data);
  return result[0].insertId;
}

export async function updatePackage(id: number, data: Partial<InsertPackage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(packages).set(data).where(eq(packages.id, id));
}

export async function deletePackage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(packages).where(eq(packages.id, id));
}

// ============ ACCESSORY QUERIES ============

export async function getAllAccessories(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(accessories).where(eq(accessories.isActive, true)).orderBy(asc(accessories.sortOrder), desc(accessories.createdAt));
  }
  return db.select().from(accessories).orderBy(asc(accessories.sortOrder), desc(accessories.createdAt));
}

export async function getAccessoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accessories).where(eq(accessories.id, id)).limit(1);
  return result[0];
}

export async function createAccessory(data: InsertAccessory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(accessories).values(data);
  return result[0].insertId;
}

export async function updateAccessory(id: number, data: Partial<InsertAccessory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(accessories).set(data).where(eq(accessories.id, id));
}

export async function deleteAccessory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(accessories).where(eq(accessories.id, id));
}

// ============ SUPERBOX QUERIES ============

export async function getAllSuperbox(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(superbox).where(eq(superbox.isActive, true)).orderBy(asc(superbox.sortOrder), asc(superbox.price));
  }
  return db.select().from(superbox).orderBy(asc(superbox.sortOrder), asc(superbox.price));
}

export async function getSuperboxById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(superbox).where(eq(superbox.id, id)).limit(1);
  return result[0];
}

export async function createSuperbox(data: InsertSuperbox) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(superbox).values(data);
  return result[0].insertId;
}

export async function updateSuperbox(id: number, data: Partial<InsertSuperbox>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(superbox).set(data).where(eq(superbox.id, id));
}

export async function deleteSuperbox(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(superbox).where(eq(superbox.id, id));
}

// ============ VISITOR STATS (ziyaretçi sayacı) ============

/** Türkiye saatine göre bugünün tarihi (YYYY-MM-DD) */
export function istanbulDay(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function recordVisit(newVisitor: boolean) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(visitStats)
    .values({ day: istanbulDay(), pageViews: 1, visitors: newVisitor ? 1 : 0 })
    .onDuplicateKeyUpdate({
      set: {
        pageViews: sql`${visitStats.pageViews} + 1`,
        visitors: sql`${visitStats.visitors} + ${newVisitor ? 1 : 0}`,
      },
    });
}

export async function getVisitSummary() {
  const empty = { todayVisitors: 0, todayViews: 0, totalVisitors: 0, totalViews: 0 };
  const db = await getDb();
  if (!db) return empty;
  const [totals] = await db
    .select({
      totalVisitors: sql<number>`COALESCE(SUM(${visitStats.visitors}), 0)`,
      totalViews: sql<number>`COALESCE(SUM(${visitStats.pageViews}), 0)`,
    })
    .from(visitStats);
  const [today] = await db.select().from(visitStats).where(eq(visitStats.day, istanbulDay())).limit(1);
  return {
    todayVisitors: today?.visitors ?? 0,
    todayViews: today?.pageViews ?? 0,
    totalVisitors: Number(totals?.totalVisitors ?? 0),
    totalViews: Number(totals?.totalViews ?? 0),
  };
}

export async function getRecentVisitStats(days: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitStats).orderBy(desc(visitStats.day)).limit(days);
}
