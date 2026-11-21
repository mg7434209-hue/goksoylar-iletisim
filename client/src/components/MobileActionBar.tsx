/*
 * Mobilde ekranın altına sabitlenen "Ara" ve "WhatsApp" çubuğu.
 * Mağaza odaklı bir site için en kritik iki eylem tek dokunuşta erişilebilir.
 * Masaüstünde ve /admin altında görünmez. Altındaki boşluk (spacer), footer'ın
 * çubuğun arkasında kalmasını engeller.
 */
import { MessageCircle, Phone } from "lucide-react";
import { useLocation } from "wouter";
import { SITE } from "@shared/seo";

const WA_TEXT = encodeURIComponent(
  "Merhaba, Göksoylar İletişim'den bilgi almak istiyorum."
);

export default function MobileActionBar() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return null;

  return (
    <>
      <div className="md:hidden h-16" aria-hidden="true" />
      <nav
        aria-label="Hızlı iletişim"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-2 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 pt-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <a
          href={`tel:${SITE.phone}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#004899] text-white text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
          Ara
        </a>
        <a
          href={`https://wa.me/${SITE.phone.replace("+", "")}?text=${WA_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          WhatsApp
        </a>
      </nav>
    </>
  );
}
