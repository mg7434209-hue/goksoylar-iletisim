import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const phonesData = [
  { slug: "iphone-16-pro-max", name: "iPhone 16 Pro Max", brand: "Apple", price: 84999, oldPrice: 89999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=500&fit=crop", storage: "256 GB", ram: "8 GB", screen: "6.9 inç OLED", camera: "48 MP + 12 MP + 48 MP", battery: "4685 mAh", color: "Titan Siyah", badge: "Yeni", installment: "12 Taksit", sortOrder: 1 },
  { slug: "iphone-16", name: "iPhone 16", brand: "Apple", price: 59999, oldPrice: 64999, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=500&fit=crop", storage: "128 GB", ram: "8 GB", screen: "6.1 inç OLED", camera: "48 MP + 12 MP", battery: "3561 mAh", color: "Mavi", badge: "Popüler", installment: "12 Taksit", sortOrder: 2 },
  { slug: "samsung-galaxy-s25-ultra", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", price: 74999, oldPrice: 79999, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=500&fit=crop", storage: "256 GB", ram: "12 GB", screen: "6.8 inç Dynamic AMOLED", camera: "200 MP + 50 MP + 10 MP + 12 MP", battery: "5000 mAh", color: "Titan Gri", badge: "Çok Satan", installment: "12 Taksit", sortOrder: 3 },
  { slug: "samsung-galaxy-a16", name: "Samsung Galaxy A16", brand: "Samsung", price: 12999, oldPrice: null, image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=500&fit=crop", storage: "128 GB", ram: "4 GB", screen: "6.5 inç AMOLED", camera: "50 MP + 5 MP + 2 MP", battery: "5000 mAh", color: "Siyah", badge: null, installment: "6 Taksit", sortOrder: 4 },
  { slug: "xiaomi-redmi-note-15-pro", name: "Xiaomi Redmi Note 15 Pro", brand: "Xiaomi", price: 17999, oldPrice: 19999, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=500&fit=crop", storage: "256 GB", ram: "8 GB", screen: "6.67 inç AMOLED", camera: "200 MP + 8 MP + 2 MP", battery: "5110 mAh", color: "Mavi", badge: "Fiyat/Performans", installment: "9 Taksit", sortOrder: 5 },
  { slug: "samsung-galaxy-s25", name: "Samsung Galaxy S25", brand: "Samsung", price: 49999, oldPrice: null, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=500&fit=crop", storage: "128 GB", ram: "8 GB", screen: "6.2 inç Dynamic AMOLED", camera: "50 MP + 12 MP + 10 MP", battery: "4000 mAh", color: "Lacivert", badge: null, installment: "12 Taksit", sortOrder: 6 },
  { slug: "iphone-15", name: "iPhone 15", brand: "Apple", price: 44999, oldPrice: 49999, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=500&fit=crop", storage: "128 GB", ram: "6 GB", screen: "6.1 inç OLED", camera: "48 MP + 12 MP", battery: "3349 mAh", color: "Pembe", badge: "İndirimli", installment: "12 Taksit", sortOrder: 7 },
  { slug: "xiaomi-15", name: "Xiaomi 15", brand: "Xiaomi", price: 37999, oldPrice: null, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop", storage: "256 GB", ram: "12 GB", screen: "6.36 inç AMOLED", camera: "50 MP + 50 MP + 50 MP", battery: "5400 mAh", color: "Siyah", badge: "Yeni", installment: "9 Taksit", sortOrder: 8 },
];

const packagesData = [
  { slug: "esneyen-paket", name: "Esneyen Paket", category: "faturali", internet: "5 GB", minutes: "1500 dk", sms: "250 SMS", price: 430, popular: false, features: JSON.stringify(["Esnek kullanım", "Turkcell uygulamaları dahil"]), sortOrder: 1 },
  { slug: "star-5gb", name: "Star+ 5 GB", category: "faturali", internet: "5 GB", minutes: "1000 dk", sms: "250 SMS", price: 550, popular: false, features: JSON.stringify(["BiP ücretsiz", "TV+ dahil"]), sortOrder: 2 },
  { slug: "star-10gb", name: "Star+ 10 GB", category: "faturali", internet: "10 GB", minutes: "1000 dk", sms: "250 SMS", price: 650, popular: false, features: JSON.stringify(["BiP ücretsiz", "TV+ dahil", "fizy müzik"]), sortOrder: 3 },
  { slug: "star-15gb", name: "Star+ 15 GB", category: "faturali", internet: "15 GB", minutes: "1000 dk", sms: "250 SMS", price: 750, popular: true, features: JSON.stringify(["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik"]), sortOrder: 4 },
  { slug: "star-20gb", name: "Star+ 20 GB", category: "faturali", internet: "20 GB", minutes: "1000 dk", sms: "500 SMS", price: 900, popular: false, features: JSON.stringify(["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik"]), sortOrder: 5 },
  { slug: "star-30gb", name: "Star+ 30 GB", category: "faturali", internet: "30 GB", minutes: "2000 dk", sms: "500 SMS", price: 1100, popular: true, features: JSON.stringify(["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik", "Platinum avantajları"]), sortOrder: 6 },
  { slug: "star-40gb", name: "Star+ 40 GB", category: "faturali", internet: "40 GB", minutes: "2000 dk", sms: "500 SMS", price: 1200, popular: false, features: JSON.stringify(["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik", "Platinum avantajları"]), sortOrder: 7 },
  { slug: "platinum-60gb", name: "Platinum+ 60 GB", category: "faturali", internet: "60 GB", minutes: "3000 dk", sms: "1000 SMS", price: 1400, popular: false, features: JSON.stringify(["Tüm Turkcell uygulamaları", "Yurt dışı kullanım", "Öncelikli müşteri hizmetleri"]), sortOrder: 8 },
  { slug: "platinum-black-120gb", name: "Platinum+ Black 120 GB", category: "faturali", internet: "120 GB", minutes: "3000 dk", sms: "1000 SMS", price: 2000, popular: false, features: JSON.stringify(["Tüm Turkcell uygulamaları", "Yurt dışı kullanım", "VIP müşteri hizmetleri", "Lounge erişimi"]), sortOrder: 9 },
  { slug: "gnc-10gb", name: "GNÇ+ 10 GB", category: "genc", internet: "10 GB", minutes: "1000 dk", sms: "300 SMS", price: 500, popular: true, features: JSON.stringify(["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları"]), sortOrder: 10 },
  { slug: "gnc-20gb", name: "GNÇ+ 20 GB", category: "genc", internet: "20 GB", minutes: "1000 dk", sms: "300 SMS", price: 650, popular: false, features: JSON.stringify(["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları", "YouTube Premium"]), sortOrder: 11 },
  { slug: "gnc-30gb", name: "GNÇ+ 30 GB", category: "genc", internet: "30 GB", minutes: "1000 dk", sms: "300 SMS", price: 800, popular: false, features: JSON.stringify(["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları", "YouTube Premium", "Netflix"]), sortOrder: 12 },
  { slug: "gnc-50gb", name: "GNÇ+ 50 GB", category: "genc", internet: "50 GB", minutes: "1000 dk", sms: "300 SMS", price: 1050, popular: false, features: JSON.stringify(["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları", "YouTube Premium", "Netflix", "Oyun paketi"]), sortOrder: 13 },
];

const accessoriesData = [
  { slug: "apple-airpods-pro-2", name: "Apple AirPods Pro 2", category: "Kulaklık", price: 8999, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop", brand: "Apple", sortOrder: 1 },
  { slug: "samsung-galaxy-buds3-pro", name: "Samsung Galaxy Buds3 Pro", category: "Kulaklık", price: 6999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", brand: "Samsung", sortOrder: 2 },
  { slug: "anker-powercore-20000", name: "Anker PowerCore 20000", category: "Powerbank", price: 1299, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop", brand: "Anker", sortOrder: 3 },
  { slug: "spigen-ultra-hybrid-kilif", name: "Spigen Ultra Hybrid Kılıf", category: "Kılıf", price: 499, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop", brand: "Spigen", sortOrder: 4 },
  { slug: "belkin-magsafe-sarj", name: "Belkin MagSafe Şarj Cihazı", category: "Şarj", price: 1899, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop", brand: "Belkin", sortOrder: 5 },
  { slug: "apple-watch-se", name: "Apple Watch SE", category: "Akıllı Saat", price: 12999, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop", brand: "Apple", sortOrder: 6 },
];

async function seed() {
  console.log("Seeding database...");

  for (const phone of phonesData) {
    await db.execute(sql`INSERT INTO phones (slug, name, brand, price, oldPrice, image, storage, ram, screen, camera, battery, color, badge, installment, isActive, sortOrder) VALUES (${phone.slug}, ${phone.name}, ${phone.brand}, ${phone.price}, ${phone.oldPrice}, ${phone.image}, ${phone.storage}, ${phone.ram}, ${phone.screen}, ${phone.camera}, ${phone.battery}, ${phone.color}, ${phone.badge}, ${phone.installment}, true, ${phone.sortOrder}) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price)`);
  }
  console.log(`✓ ${phonesData.length} phones seeded`);

  for (const pkg of packagesData) {
    await db.execute(sql`INSERT INTO packages (slug, name, category, internet, minutes, sms, price, popular, features, isActive, sortOrder) VALUES (${pkg.slug}, ${pkg.name}, ${pkg.category}, ${pkg.internet}, ${pkg.minutes}, ${pkg.sms}, ${pkg.price}, ${pkg.popular}, ${pkg.features}, true, ${pkg.sortOrder}) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price)`);
  }
  console.log(`✓ ${packagesData.length} packages seeded`);

  for (const acc of accessoriesData) {
    await db.execute(sql`INSERT INTO accessories (slug, name, category, price, image, brand, isActive, sortOrder) VALUES (${acc.slug}, ${acc.name}, ${acc.category}, ${acc.price}, ${acc.image}, ${acc.brand}, true, ${acc.sortOrder}) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price)`);
  }
  console.log(`✓ ${accessoriesData.length} accessories seeded`);

  console.log("✓ Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
