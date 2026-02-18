// ============================================================
// Göksoylar İletişim - Veri Katmanı
// Turkcell Yetkili Bayi - Telefon, Paket ve Aksesuar Verileri
// ============================================================

export interface Phone {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  storage: string;
  ram: string;
  screen: string;
  camera: string;
  battery: string;
  color: string;
  badge?: string;
  installment?: string;
}

export interface TurkcellPackage {
  id: string;
  name: string;
  category: "faturali" | "faturasiz" | "genç";
  internet: string;
  minutes: string;
  sms: string;
  price: number;
  popular?: boolean;
  features?: string[];
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  brand: string;
}

// Telefon Verileri
export const phones: Phone[] = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    price: 84999,
    oldPrice: 89999,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=500&fit=crop",
    storage: "256 GB",
    ram: "8 GB",
    screen: "6.9 inç OLED",
    camera: "48 MP + 12 MP + 48 MP",
    battery: "4685 mAh",
    color: "Titan Siyah",
    badge: "Yeni",
    installment: "12 Taksit",
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    brand: "Apple",
    price: 59999,
    oldPrice: 64999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=500&fit=crop",
    storage: "128 GB",
    ram: "8 GB",
    screen: "6.1 inç OLED",
    camera: "48 MP + 12 MP",
    battery: "3561 mAh",
    color: "Mavi",
    badge: "Popüler",
    installment: "12 Taksit",
  },
  {
    id: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    price: 74999,
    oldPrice: 79999,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=500&fit=crop",
    storage: "256 GB",
    ram: "12 GB",
    screen: "6.8 inç Dynamic AMOLED",
    camera: "200 MP + 50 MP + 10 MP + 12 MP",
    battery: "5000 mAh",
    color: "Titan Gri",
    badge: "Çok Satan",
    installment: "12 Taksit",
  },
  {
    id: "samsung-galaxy-a16",
    name: "Samsung Galaxy A16",
    brand: "Samsung",
    price: 12999,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=500&fit=crop",
    storage: "128 GB",
    ram: "4 GB",
    screen: "6.5 inç AMOLED",
    camera: "50 MP + 5 MP + 2 MP",
    battery: "5000 mAh",
    color: "Siyah",
    installment: "6 Taksit",
  },
  {
    id: "xiaomi-redmi-note-15-pro",
    name: "Xiaomi Redmi Note 15 Pro",
    brand: "Xiaomi",
    price: 17999,
    oldPrice: 19999,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=500&fit=crop",
    storage: "256 GB",
    ram: "8 GB",
    screen: "6.67 inç AMOLED",
    camera: "200 MP + 8 MP + 2 MP",
    battery: "5110 mAh",
    color: "Mavi",
    badge: "Fiyat/Performans",
    installment: "9 Taksit",
  },
  {
    id: "samsung-galaxy-s25",
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    price: 49999,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=500&fit=crop",
    storage: "128 GB",
    ram: "8 GB",
    screen: "6.2 inç Dynamic AMOLED",
    camera: "50 MP + 12 MP + 10 MP",
    battery: "4000 mAh",
    color: "Lacivert",
    installment: "12 Taksit",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    price: 44999,
    oldPrice: 49999,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=500&fit=crop",
    storage: "128 GB",
    ram: "6 GB",
    screen: "6.1 inç OLED",
    camera: "48 MP + 12 MP",
    battery: "3349 mAh",
    color: "Pembe",
    badge: "İndirimli",
    installment: "12 Taksit",
  },
  {
    id: "xiaomi-15",
    name: "Xiaomi 15",
    brand: "Xiaomi",
    price: 37999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop",
    storage: "256 GB",
    ram: "12 GB",
    screen: "6.36 inç AMOLED",
    camera: "50 MP + 50 MP + 50 MP",
    battery: "5400 mAh",
    color: "Siyah",
    badge: "Yeni",
    installment: "9 Taksit",
  },
];

// Türkcell Paket Verileri
export const turkcellPackages: TurkcellPackage[] = [
  {
    id: "esneyen-paket",
    name: "Esneyen Paket",
    category: "faturali",
    internet: "5 GB",
    minutes: "1500 dk",
    sms: "250 SMS",
    price: 430,
    features: ["Esnek kullanım", "Turkcell uygulamaları dahil"],
  },
  {
    id: "star-5gb",
    name: "Star+ 5 GB",
    category: "faturali",
    internet: "5 GB",
    minutes: "1000 dk",
    sms: "250 SMS",
    price: 550,
    features: ["BiP ücretsiz", "TV+ dahil"],
  },
  {
    id: "star-10gb",
    name: "Star+ 10 GB",
    category: "faturali",
    internet: "10 GB",
    minutes: "1000 dk",
    sms: "250 SMS",
    price: 650,
    features: ["BiP ücretsiz", "TV+ dahil", "fizy müzik"],
  },
  {
    id: "star-15gb",
    name: "Star+ 15 GB",
    category: "faturali",
    internet: "15 GB",
    minutes: "1000 dk",
    sms: "250 SMS",
    price: 750,
    popular: true,
    features: ["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik"],
  },
  {
    id: "star-20gb",
    name: "Star+ 20 GB",
    category: "faturali",
    internet: "20 GB",
    minutes: "1000 dk",
    sms: "500 SMS",
    price: 900,
    features: ["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik"],
  },
  {
    id: "star-30gb",
    name: "Star+ 30 GB",
    category: "faturali",
    internet: "30 GB",
    minutes: "2000 dk",
    sms: "500 SMS",
    price: 1100,
    popular: true,
    features: ["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik", "Platinum avantajları"],
  },
  {
    id: "star-40gb",
    name: "Star+ 40 GB",
    category: "faturali",
    internet: "40 GB",
    minutes: "2000 dk",
    sms: "500 SMS",
    price: 1200,
    features: ["BiP ücretsiz", "TV+ dahil", "fizy müzik", "Dergilik", "Platinum avantajları"],
  },
  {
    id: "platinum-60gb",
    name: "Platinum+ 60 GB",
    category: "faturali",
    internet: "60 GB",
    minutes: "3000 dk",
    sms: "1000 SMS",
    price: 1400,
    features: ["Tüm Turkcell uygulamaları", "Yurt dışı kullanım", "Öncelikli müşteri hizmetleri"],
  },
  {
    id: "platinum-black-120gb",
    name: "Platinum+ Black 120 GB",
    category: "faturali",
    internet: "120 GB",
    minutes: "3000 dk",
    sms: "1000 SMS",
    price: 2000,
    features: ["Tüm Turkcell uygulamaları", "Yurt dışı kullanım", "VIP müşteri hizmetleri", "Lounge erişimi"],
  },
  {
    id: "gnc-10gb",
    name: "GNÇ+ 10 GB",
    category: "genç",
    internet: "10 GB",
    minutes: "1000 dk",
    sms: "300 SMS",
    price: 500,
    popular: true,
    features: ["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları"],
  },
  {
    id: "gnc-20gb",
    name: "GNÇ+ 20 GB",
    category: "genç",
    internet: "20 GB",
    minutes: "1000 dk",
    sms: "300 SMS",
    price: 650,
    features: ["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları", "YouTube Premium"],
  },
  {
    id: "gnc-30gb",
    name: "GNÇ+ 30 GB",
    category: "genç",
    internet: "30 GB",
    minutes: "1000 dk",
    sms: "300 SMS",
    price: 800,
    features: ["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları", "YouTube Premium", "Netflix"],
  },
  {
    id: "gnc-50gb",
    name: "GNÇ+ 50 GB",
    category: "genç",
    internet: "50 GB",
    minutes: "1000 dk",
    sms: "300 SMS",
    price: 1050,
    features: ["Sosyal medya paketi", "Spotify ücretsiz", "GNÇ avantajları", "YouTube Premium", "Netflix", "Oyun paketi"],
  },
];

// Aksesuar Verileri
export const accessories: Accessory[] = [
  { id: "acc-1", name: "Apple AirPods Pro 2", category: "Kulaklık", price: 8999, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop", brand: "Apple" },
  { id: "acc-2", name: "Samsung Galaxy Buds3 Pro", category: "Kulaklık", price: 6999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", brand: "Samsung" },
  { id: "acc-3", name: "Anker PowerCore 20000", category: "Powerbank", price: 1299, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop", brand: "Anker" },
  { id: "acc-4", name: "Spigen Ultra Hybrid Kılıf", category: "Kılıf", price: 499, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop", brand: "Spigen" },
  { id: "acc-5", name: "Belkin MagSafe Şarj Cihazı", category: "Şarj", price: 1899, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop", brand: "Belkin" },
  { id: "acc-6", name: "Apple Watch SE", category: "Akıllı Saat", price: 12999, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop", brand: "Apple" },
];

// Marka Filtreleri
export const phoneBrands = ["Tümü", "Apple", "Samsung", "Xiaomi"];

// Paket Kategorileri
export const packageCategories = [
  { id: "faturali", label: "Faturalı" },
  { id: "genç", label: "Gençlere Özel" },
];

// Fiyat formatlama
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR").format(price) + " TL";
}
