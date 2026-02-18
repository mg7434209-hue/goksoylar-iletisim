import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const superboxPackets = [
  // 5G'ye Hazır
  { slug: "superbox-5g-hazir-250gb", name: "Superbox 5G Hazır 250 GB", category: "5g-hazir", speed: "4.5G", quota: "250 GB", commitment: "12 Ay", price: 1100, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 1 },
  { slug: "superbox-5g-hazir-500gb", name: "Superbox 5G Hazır 500 GB", category: "5g-hazir", speed: "4.5G", quota: "500 GB", commitment: "12 Ay", price: 1350, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: true, sortOrder: 2 },
  { slug: "superbox-5g-hazir-1tb", name: "Superbox 5G Hazır 1 TB", category: "5g-hazir", speed: "4.5G", quota: "1 TB", commitment: "12 Ay", price: 1850, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 3 },

  // Ana Paketler (Devam)
  { slug: "superbox-devam-200gb", name: "Superbox Devam 200 GB", category: "devam", speed: "4.5G", quota: "200 GB", commitment: "12 Ay", price: 1000, bonus: "50 GB Hediye", bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: false, popular: false, sortOrder: 4 },
  { slug: "superbox-devam-500gb", name: "Superbox Devam 500 GB", category: "devam", speed: "4.5G", quota: "500 GB", commitment: "12 Ay", price: 1250, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: true, sortOrder: 5 },
  { slug: "superbox-devam-1tb", name: "Superbox Devam 1 TB", category: "devam", speed: "4.5G", quota: "1 TB", commitment: "12 Ay", price: 1750, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 6 },
  { slug: "superbox-devam-2tb", name: "Superbox Devam 2 TB", category: "devam", speed: "4.5G", quota: "2 TB", commitment: "12 Ay", price: 2500, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 7 },

  // Çalıştır Devam
  { slug: "superbox-calistir-devam-200gb", name: "Superbox Çalıştır Devam 200 GB", category: "calistir-devam", speed: "4.5G", quota: "200 GB", commitment: "12 Ay", price: 1000, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: false, popular: false, sortOrder: 8 },
  { slug: "superbox-calistir-devam-500gb", name: "Superbox Çalıştır Devam 500 GB", category: "calistir-devam", speed: "4.5G", quota: "500 GB", commitment: "12 Ay", price: 1250, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 9 },
  { slug: "superbox-calistir-devam-1tb", name: "Superbox Çalıştır Devam 1 TB", category: "calistir-devam", speed: "4.5G", quota: "1 TB", commitment: "12 Ay", price: 1750, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 10 },
  { slug: "superbox-calistir-devam-2tb", name: "Superbox Çalıştır Devam 2 TB", category: "calistir-devam", speed: "4.5G", quota: "2 TB", commitment: "12 Ay", price: 2500, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 11 },

  // Dijitale Özel (Online'a Özel)
  { slug: "superbox-dijitale-ozel-100gb", name: "Superbox Dijitale Özel 100 GB", category: "dijitale-ozel", speed: "4.5G", quota: "100 GB", commitment: "12 Ay", price: 690, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: true, popular: true, sortOrder: 12 },
  { slug: "superbox-dijitale-ozel-300gb", name: "Superbox Dijitale Özel 300 GB", category: "dijitale-ozel", speed: "4.5G", quota: "300 GB", commitment: "12 Ay", price: 1000, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: true, popular: false, sortOrder: 13 },
  { slug: "superbox-dijitale-ozel-1tb", name: "Superbox Dijitale Özel 1 TB", category: "dijitale-ozel", speed: "4.5G", quota: "1 TB", commitment: "12 Ay", price: 1700, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: true, popular: false, sortOrder: 14 },
  { slug: "superbox-dijitale-ozel-2tb", name: "Superbox Dijitale Özel 2 TB", category: "dijitale-ozel", speed: "4.5G", quota: "2 TB", commitment: "12 Ay", price: 2800, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: true, popular: false, sortOrder: 15 },

  // 4.5G Paketler
  { slug: "superbox-4-5g-100gb", name: "Superbox 4.5G 100 GB", category: "4-5g", speed: "4.5G", quota: "100 GB", commitment: "12 Ay", price: 690, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: false, popular: false, sortOrder: 16 },
  { slug: "superbox-4-5g-300gb", name: "Superbox 4.5G 300 GB", category: "4-5g", speed: "4.5G", quota: "300 GB", commitment: "12 Ay", price: 1000, bonus: null, bonusDetail: "12 Ay Boyunca Her Ay Hediye", isOnlineExclusive: false, popular: false, sortOrder: 17 },
  { slug: "superbox-4-5g-1tb", name: "Superbox 4.5G 1 TB", category: "4-5g", speed: "4.5G", quota: "1 TB", commitment: "12 Ay", price: 1700, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 18 },
  { slug: "superbox-4-5g-2tb", name: "Superbox 4.5G 2 TB", category: "4-5g", speed: "4.5G", quota: "2 TB", commitment: "12 Ay", price: 2800, bonus: null, bonusDetail: null, isOnlineExclusive: false, popular: false, sortOrder: 19 },
];

async function seed() {
  console.log("Seeding Superbox packages...");
  for (const pkg of superboxPackets) {
    await db.execute(sql`
      INSERT INTO superbox (slug, name, category, speed, quota, commitment, price, bonus, bonusDetail, isOnlineExclusive, popular, isActive, sortOrder)
      VALUES (${pkg.slug}, ${pkg.name}, ${pkg.category}, ${pkg.speed}, ${pkg.quota}, ${pkg.commitment}, ${pkg.price}, ${pkg.bonus}, ${pkg.bonusDetail}, ${pkg.isOnlineExclusive}, ${pkg.popular}, true, ${pkg.sortOrder})
      ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), price=VALUES(price), quota=VALUES(quota), bonus=VALUES(bonus), bonusDetail=VALUES(bonusDetail), isOnlineExclusive=VALUES(isOnlineExclusive), popular=VALUES(popular), sortOrder=VALUES(sortOrder)
    `);
    console.log(`  ✓ ${pkg.name}`);
  }
  console.log(`Done! ${superboxPackets.length} Superbox packages seeded.`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
