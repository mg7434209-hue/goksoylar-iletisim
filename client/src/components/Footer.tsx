/*
 * Göksoylar İletişim - Footer
 * Design: Digital Wave - Koyu lacivert zemin, dalga SVG divider
 */
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative">
      {/* Wave Divider */}
      <div className="relative -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 60L48 55C96 50 192 40 288 45C384 50 480 70 576 75C672 80 768 70 864 55C960 40 1056 20 1152 15C1248 10 1344 20 1392 25L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
            fill="#001F3F"
          />
        </svg>
      </div>

      <div className="bg-[#001F3F] text-white">
        <div className="container py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Marka */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FFD200] flex items-center justify-center">
                  <span className="text-[#004899] font-bold text-lg font-[Poppins]">G</span>
                </div>
                <div className="leading-tight">
                  <span className="text-white font-bold text-lg font-[Poppins] block">Göksoylar</span>
                  <span className="text-gray-400 text-xs tracking-wide">İLETİŞİM</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Türkcell Yetkili Bayisi olarak en güncel cep telefonları, Türkcell paketleri ve aksesuarları uygun fiyatlarla sunuyoruz.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-white/10 px-3 py-1.5 rounded-full">Türkcell Yetkili Bayi</span>
              </div>
            </div>

            {/* Hızlı Linkler */}
            <div>
              <h4 className="text-[#FFD200] font-semibold font-[Poppins] mb-5">Hızlı Linkler</h4>
              <ul className="space-y-3">
                {[
                  { href: "/telefonlar", label: "Cep Telefonları" },
                  { href: "/paketler", label: "Türkcell Paketler" },
                  { href: "/aksesuarlar", label: "Aksesuarlar" },
                  { href: "/hakkimizda", label: "Hakkımızda" },
                  { href: "/iletisim", label: "İletişim" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#FFD200] transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* İletişim */}
            <div>
              <h4 className="text-[#FFD200] font-semibold font-[Poppins] mb-5">İletişim</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FFD200] mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">Atatürk Cad. No: 42, Merkez / İstanbul</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#FFD200] shrink-0" />
                  <a href="tel:+905349777000" className="text-gray-400 hover:text-white transition-colors text-sm">
                    0534 977 70 00
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#FFD200] shrink-0" />
                  <a href="mailto:info@goksoylar.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                    info@goksoylar.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FFD200] mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">Pzt - Cmt: 09:00 - 20:00</span>
                </li>
              </ul>
            </div>

            {/* Çalışma Saatleri */}
            <div>
              <h4 className="text-[#FFD200] font-semibold font-[Poppins] mb-5">Neden Biz?</h4>
              <ul className="space-y-3">
                {[
                  "Türkcell Yetkili Bayi Güvencesi",
                  "12 Aya Varan Taksit İmkanı",
                  "Ücretsiz Kargo",
                  "Teknik Destek & Servis",
                  "Numara Taşıma Kolaylığı",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; 2026 Göksoylar İletişim. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <span>Gizlilik Politikası</span>
              <span>Kullanım Koşulları</span>
              <span>KVKK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
