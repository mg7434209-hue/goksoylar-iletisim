/*
 * Sık sorulan sorular. Ana sayfadaki görünür bölüm ve FAQPage JSON-LD
 * aynı kaynaktan beslenir; içerik sitede zaten yazan bilgilerle sınırlıdır
 * (adres, saatler, taksit, kargo, numara taşıma, Superbox).
 * Fiyat gibi sık değişen bilgi buraya YAZILMAZ.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Göksoylar İletişim nerede, çalışma saatleri nedir?",
    answer:
      "Göksoylar İletişim, Manavgat / Antalya'da Aşağı Pazarcı, Zübeyde Hanım Cd. No:44 adresindedir. Pazartesi - Cumartesi 09:00 - 20:00 saatleri arasında hizmet veriyoruz, Pazar günleri kapalıyız.",
  },
  {
    question: "Göksoylar İletişim Türkcell yetkili bayisi mi?",
    answer:
      "Evet. Göksoylar İletişim, 10 yılı aşkın süredir Manavgat'ta Türkcell Yetkili Bayisi olarak hizmet vermektedir.",
  },
  {
    question: "Cep telefonunu taksitle alabilir miyim?",
    answer:
      "Evet, 12 aya varan taksit imkânı sunuyoruz. Güncel modeller için Cep Telefonları sayfasına bakabilir veya WhatsApp'tan bize yazabilirsiniz.",
  },
  {
    question: "Kargo ücretli mi?",
    answer: "Hayır, siparişleriniz için ücretsiz kargo imkânı sunuyoruz.",
  },
  {
    question: "Numaramı Türkcell'e taşıyabilir miyim?",
    answer:
      "Evet, numara taşıma işlemlerinizde yardımcı oluyoruz. Detaylı bilgi için 0534 977 70 00 numaralı hattan veya WhatsApp üzerinden bize ulaşabilirsiniz.",
  },
  {
    question: "Türkcell Superbox nedir?",
    answer:
      "Superbox, fiber altyapı gerektirmeden sadece bir prize takarak kullanılan taşınabilir bir ev internetidir. Paketlerde 12 ay sabit fiyat uygulanır; kotanız bittiğinde hız düşer, aşım derdi yaşamazsınız.",
  },
  {
    question: "Nasıl sipariş veya başvuru yapabilirim?",
    answer:
      "Ürün ve paket sayfalarındaki WhatsApp butonlarını kullanarak ya da 0534 977 70 00 numaralı telefondan bize ulaşarak sipariş ve başvuru yapabilirsiniz.",
  },
];
