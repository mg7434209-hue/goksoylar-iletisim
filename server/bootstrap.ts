/*
 * Veritabanı açılış hazırlığı: migration'ları uygular ve tablolar boşsa
 * başlangıç verilerini yükler. Railway gibi ortamlarda elle `db:push` /
 * seed çalıştırma ihtiyacını ortadan kaldırır.
 */
import fs from "fs";
import path from "path";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { getDb } from "./db";
import { phones, packages, accessories, superbox } from "../drizzle/schema";
import { phonesSeed, packagesSeed, accessoriesSeed, superboxSeed } from "./seed-data";

function findMigrationsFolder(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "drizzle"),
    path.resolve(import.meta.dirname ?? ".", "..", "drizzle"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "meta", "_journal.json"))) {
      return dir;
    }
  }
  return null;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Bootstrap] DATABASE_URL tanımlı değil veya bağlantı kurulamadı, migration/seed atlandı");
    return;
  }

  const migrationsFolder = findMigrationsFolder();
  if (migrationsFolder) {
    try {
      await migrate(db, { migrationsFolder });
      console.log("[Bootstrap] Veritabanı migration'ları uygulandı");
    } catch (error) {
      console.error("[Bootstrap] Migration hatası:", error);
    }
  } else {
    console.warn("[Bootstrap] Migration klasörü bulunamadı, atlandı");
  }

  const seedTargets = [
    { label: "phones", table: phones, data: phonesSeed },
    { label: "packages", table: packages, data: packagesSeed },
    { label: "accessories", table: accessories, data: accessoriesSeed },
    { label: "superbox", table: superbox, data: superboxSeed },
  ] as const;

  for (const { label, table, data } of seedTargets) {
    try {
      const existing = await db.select({ id: table.id }).from(table).limit(1);
      if (existing.length === 0) {
        await db.insert(table).values([...data]);
        console.log(`[Bootstrap] ${label} tablosu boştu, ${data.length} kayıt yüklendi`);
      }
    } catch (error) {
      console.error(`[Bootstrap] ${label} seed hatası:`, error);
    }
  }
}
