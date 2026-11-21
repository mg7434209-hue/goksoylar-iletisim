/*
 * Harici (CDN) afiş görseli yüklenemezse tarayıcının kırık-resim ikonu ve alt
 * metni yerine sessizce bir yedeğe düşer: yedek verilmişse onu, verilmemişse
 * hiçbir şey göstermez (üstteki zemin rengi görünür).
 * Görsel yüklenebiliyorsa tam olarak sıradan bir <img> gibi davranır.
 */
import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

interface BannerImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Görsel yüklenemezse gösterilecek içerik. */
  fallback?: ReactNode;
}

export default function BannerImage({
  fallback = null,
  onError,
  ...props
}: BannerImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <img
      {...props}
      onError={e => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}

/** Mağaza görseli yüklenemediğinde gösterilen, CSS ile çizilmiş marka kartı. */
export function StorePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Göksoylar İletişim - Türkcell Yetkili Bayi, Manavgat / Antalya"
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0a5cc0] to-[#00306b] text-white ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-[#FFD200] text-[#004899] flex items-center justify-center text-5xl font-extrabold font-[Poppins] shadow-lg">
        G
      </div>
      <p className="text-2xl lg:text-3xl font-extrabold font-[Poppins]">
        Göksoylar İletişim
      </p>
      <p className="text-[#FFD200] font-semibold">Türkcell Yetkili Bayi</p>
      <p className="text-white/80 text-sm">Manavgat / Antalya</p>
    </div>
  );
}
