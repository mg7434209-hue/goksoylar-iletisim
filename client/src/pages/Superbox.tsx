import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import {
  Wifi, Signal, Clock, Gift, Star, Zap, Globe, ChevronRight, Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const categories = [
  { key: "all", label: "Tümü", icon: Globe },
  { key: "5g-hazir", label: "5G'ye Hazır", icon: Zap },
  { key: "devam", label: "Ana Paketler", icon: Signal },
  { key: "calistir-devam", label: "Çalıştır Devam", icon: Wifi },
  { key: "dijitale-ozel", label: "Dijitale Özel", icon: Star },
  { key: "4-5g", label: "4.5G Paketler", icon: Globe },
];

export default function Superbox() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: superboxList, isLoading } = trpc.superbox.list.useQuery();

  const filtered = activeCategory === "all"
    ? superboxList
    : superboxList?.filter((s: any) => s.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004899] via-[#003570] to-[#002244]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#FFD200] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#004899] rounded-full blur-[150px]" />
        </div>
        <div className="relative container py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
              <Wifi className="w-4 h-4 text-[#FFD200]" />
              <span className="text-white/90 text-sm font-medium">Turkcell Superbox</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-[Poppins] leading-tight mb-6">
              Fiber Hızında{" "}
              <span className="text-[#FFD200]">Taşınabilir</span>{" "}
              İnternet
            </h1>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Üstün 4.5G teknolojisiyle evinizde, ofisinizde veya istediğiniz her yerde kesintisiz internet deneyimi. 12 ay taahhütle avantajlı fiyatlar.
            </p>
          </motion.div>
        </div>
        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 20 1380 15L1440 10V80H0V40Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-[#F8FAFC] py-8 border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wifi, label: "4.5G Hızında", desc: "Fiber hızında internet" },
              { icon: Clock, label: "12 Ay Taahhüt", desc: "Uygun aylık ödeme" },
              { icon: Gift, label: "Hediye GB", desc: "Seçili paketlerde bonus" },
              { icon: Zap, label: "5G'ye Hazır", desc: "Geleceğe yatırım" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#004899]/8 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-[#004899]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-[#F8FAFC] pt-8 pb-4">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.key
                    ? "bg-[#004899] text-white shadow-lg shadow-[#004899]/25"
                    : "bg-white text-gray-600 hover:text-[#004899] border border-gray-200 hover:border-[#004899]/30"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="bg-[#F8FAFC] py-10 pb-20 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#004899] animate-spin" />
            </div>
          ) : filtered && filtered.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((pkg: any) => (
                <motion.div key={pkg.id} variants={fadeInUp}>
                  <SuperboxCard pkg={pkg} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Wifi className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Bu kategoride paket bulunamadı.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#004899] py-16">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins] mb-4">
            Hemen Başvurun
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Superbox başvurunuz için mağazamızı ziyaret edin veya bizi arayın. Uzman ekibimiz size en uygun paketi seçmenize yardımcı olacaktır.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+905349777000"
              className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg text-sm"
            >
              0534 977 70 00
            </a>
            <a
              href="https://wa.me/905349777000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/25 transition-all border border-white/20 text-sm"
            >
              WhatsApp ile İletişim
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ===== SUPERBOX CARD ===== */
function SuperboxCard({ pkg }: { pkg: any }) {
  const categoryLabels: Record<string, string> = {
    "5g-hazir": "5G'ye Hazır",
    "devam": "Ana Paket",
    "calistir-devam": "Çalıştır Devam",
    "dijitale-ozel": "Dijitale Özel",
    "4-5g": "4.5G",
  };

  const categoryColors: Record<string, string> = {
    "5g-hazir": "bg-purple-100 text-purple-700",
    "devam": "bg-blue-100 text-blue-700",
    "calistir-devam": "bg-teal-100 text-teal-700",
    "dijitale-ozel": "bg-amber-100 text-amber-700",
    "4-5g": "bg-green-100 text-green-700",
  };

  return (
    <div className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
      pkg.popular ? "border-[#FFD200] shadow-lg ring-2 ring-[#FFD200]/30" : "border-gray-100 hover:border-[#004899]/20"
    }`}>
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD200] text-[#004899] text-xs font-bold px-4 py-1 rounded-full">
          Popüler
        </span>
      )}
      {pkg.isOnlineExclusive && (
        <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Online'a Özel
        </span>
      )}

      {/* Category Badge */}
      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 ${categoryColors[pkg.category] || "bg-gray-100 text-gray-600"}`}>
        {categoryLabels[pkg.category] || pkg.category}
      </span>

      <h3 className="font-bold text-[#004899] font-[Poppins] text-base mb-4 leading-tight">{pkg.name}</h3>

      {/* Speed */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#004899]/8 flex items-center justify-center">
          <Signal className="w-4 h-4 text-[#004899]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{pkg.speed}</p>
          <p className="text-xs text-gray-500">Hızında İnternet</p>
        </div>
      </div>

      {/* Quota */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#004899]/8 flex items-center justify-center">
          <Globe className="w-4 h-4 text-[#004899]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{pkg.quota}</p>
          <p className="text-xs text-gray-500">Kota</p>
        </div>
      </div>

      {/* Commitment */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#004899]/8 flex items-center justify-center">
          <Clock className="w-4 h-4 text-[#004899]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{pkg.commitment}</p>
          <p className="text-xs text-gray-500">Taahhüt</p>
        </div>
      </div>

      {/* Bonus */}
      {(pkg.bonus || pkg.bonusDetail) && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFD200]/15 flex items-center justify-center">
            <Gift className="w-4 h-4 text-[#004899]" />
          </div>
          <div>
            {pkg.bonus && <p className="text-sm font-semibold text-[#004899]">{pkg.bonus}</p>}
            {pkg.bonusDetail && <p className="text-xs text-gray-500">{pkg.bonusDetail}</p>}
          </div>
        </div>
      )}

      {/* Price & CTA */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-end gap-1 mb-4">
          <span className="text-3xl font-extrabold text-[#004899] font-[Poppins]">
            {pkg.price.toLocaleString("tr-TR")}
          </span>
          <span className="text-gray-500 text-sm mb-1">TL/ay</span>
        </div>
        <a
          href="tel:+905349777000"
          className={`w-full block text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${
            pkg.popular
              ? "bg-[#FFD200] text-[#004899] hover:bg-yellow-300"
              : "bg-[#004899] text-white hover:bg-[#003570]"
          }`}
        >
          Hemen Başvur
        </a>
      </div>
    </div>
  );
}
