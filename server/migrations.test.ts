import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

/*
 * İlk 5 migration (0000-0004) Drizzle migration kaydı tutulmadan oluşturulmuş
 * eski veritabanlarında da çalışabilmelidir: tablolar zaten varsa
 * "Table already exists" hatasıyla durup sonraki migration'lara (sayaç,
 * iletişim mesajları) hiç ulaşılmaması gerekir. Bu yüzden CREATE TABLE
 * ifadeleri IF NOT EXISTS içerir; drizzle-kit ile yeniden üretilirse bu
 * test uyarır.
 */
const DRIZZLE_DIR = path.resolve(import.meta.dirname, "..", "drizzle");
const LEGACY_SAFE_MIGRATIONS = 5;

describe("eski veritabanlarıyla uyumlu migration'lar", () => {
  const journal = JSON.parse(
    fs.readFileSync(path.join(DRIZZLE_DIR, "meta", "_journal.json"), "utf-8")
  ) as { entries: { idx: number; tag: string }[] };

  it("ilk 5 migration'ın tüm CREATE TABLE ifadeleri IF NOT EXISTS içerir", () => {
    const legacy = journal.entries.filter(e => e.idx < LEGACY_SAFE_MIGRATIONS);
    expect(legacy).toHaveLength(LEGACY_SAFE_MIGRATIONS);
    for (const entry of legacy) {
      const sql = fs.readFileSync(
        path.join(DRIZZLE_DIR, `${entry.tag}.sql`),
        "utf-8"
      );
      const creates = sql.match(/CREATE TABLE\s+(?!IF NOT EXISTS)/gi) ?? [];
      expect(creates, `${entry.tag}.sql`).toEqual([]);
      expect(sql, `${entry.tag}.sql`).toMatch(/CREATE TABLE IF NOT EXISTS/);
    }
  });
});
