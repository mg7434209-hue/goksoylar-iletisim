/*
 * Göksoylar İletişim - Ana Sayfa
 * Design: Digital Wave - Turkcell Blue/Yellow, dalga geçişleri, glassmorphism kartlar
 * Font: Poppins (başlıklar), DM Sans (gövde)
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Smartphone, Wifi, Shield, Truck, ChevronRight,
  Signal, MessageSquare, Globe, Star, ArrowRight, MessageCircle
} from "lucide-react";
import { phones as staticPhones, turkcellPackages as staticPackages, accessories as staticAccessories, formatPrice } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HERO_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-1_1771431375000_na1fn_aGVyby1iYW5uZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTFfMTc3MTQzMTM3NTAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TG1VDMJ4j2IUlIEKeffMA7Vbnlc5uOSFmDWNOUe3aDk4yfzEzmdYoZ~fQDG0aTO2rUViDYmzxCAxGCHbcgw4uhXLjiS34QpDSeu7MEvMN0Q67mVZCKKkxI1dyzxz7-DO7G~SyrBzdXKCsiKX~r3o8OvzFEQHTbhchmlHLpTHgPbeYfn6BmKY7R2tGGUlOW5qJ9lF2DXW~8ItDRIASNwhLBlyIHRPVdOTtYEGx9gNWzdDq-wwdyS7vK059XeuH-4tHub7qpeyRZCJ9hzjwNdh-TVuR0HbfChzWXkxNS~TNK4z0q9RCyndAuL0wcTU1~1mCxqAz2InZduflWjF0pMrKQ__";

const WAVE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-3_1771431371000_na1fn_dHVya2NlbGwtcGFja2FnZXM.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTNfMTc3MTQzMTM3MTAwMF9uYTFmbl9kSFZ5YTJObGJHd3RjR0ZqYTJGblpYTS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=X5Lb~az1Yf600Uu~wN0~XbXCYCFe1Rz8XMB4cz04vxWZuVT9loPCXxnPyfxAGC29bRf2Xy5LdANr1hvEe12U1vB8-XbF4D~76bzaFKEKXz~Fx9Hwvmio1Bxocb0~NRMpH0y0gSXg~pl1p7YpE-ZYuU7bKY8tyccP5frCr-FL7uzKJQDUaicAI34AggrUZdWhRStJLFfd4G52P0-CT2aVMjqPwncsbUC3X7J3V5MJWbxZ7MjeH2UBqhwVMk1vFWHVC3-3d9NDt-g71tMmgc9jH8CYE~dTi2XZ2j1C2rSAdbB09YkwBHFg76zV9ut~tiusUdwBvVzPXFAZSdjad-6kYA__";

const ACCESSORIES_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-4_1771431374000_na1fn_YWNjZXNzb3JpZXMtYmFubmVy.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTRfMTc3MTQzMTM3NDAwMF9uYTFmbl9ZV05qWlhOemIzSnBaWE10WW1GdWJtVnkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OoLyDYsu8vTerngtk6TW45JN-K0ZTyERCiAUSK3XuoajpzddA6JbjXLX2CvwSuKUPZMTvvWE3TgLJN7JCEOkZhSQoD~yf0h0XG6doTsnjRwFbKhvmYGpSLRw0GKZ5cwwkiAaDjp~qqB7OJ53sph88LdUFqDq7I3XEolcYLuFE9Qprp0wW-O1~aqbyha~fpWEylAWjjPV3sR2KksVF--Nh8sLlnLvCiyXdZ9GWO3ohsWg6pGxcf0b5Q4hwnk0sE0UTctHwBPoPTO20--k2TGU1YbbOKlGBkAq9qc7nYFFlVNFhvY6btisd1z28MjcpAoEPvv5b-TQEVJXEpPsEHmoTA__";

const STORE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-5_1771431363000_na1fn_c3RvcmUtZnJvbnQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTVfMTc3MTQzMTM2MzAwMF9uYTFmbl9jM1J2Y21VdFpuSnZiblEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PuPJsSOEHlIvYhFWZSvel~Z0fIBo21qXN0EDJDnOSQ4vqG4Ckdn-RZ4OdI1EhZkskqB3n4IfDmGGZJ-NEGtBkZUh7G0UMz5d5Vubz5aOpHOWdlxyfLnLydF9c9rwVNvxT3hgigA~xcyO6gW2klhgrHSZXx8B2XbSSgVcTCdknJI9BrYsvsiUmIikb6lEYlWzGqUP4CX0VL6SWhLBykKNuzJdWn8uXM1TY~guXMKG0oEBDeW4Gpl0GLjrQt6cHNepayukRg1~8J7MjOPp59ThDaZysMgVYHktCB1un4pIJC5yR6TWSVYl2Ne1UILt-28zt7Fyps1mKsvOB1TNzlbkZA__";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const { data: dbPhones } = trpc.phones.list.useQuery();
  const { data: dbPackages } = trpc.packages.list.useQuery();
  const { data: dbAccessories } = trpc.accessories.list.useQuery();

  const phones = dbPhones && dbPhones.length > 0 ? dbPhones : staticPhones;
  const allPackages = dbPackages && dbPackages.length > 0 ? dbPackages : staticPackages;
  const allAccessories = dbAccessories && dbAccessories.length > 0 ? dbAccessories : staticAccessories;

  const [pkgFilter, setPkgFilter] = useState<"faturali" | "genc">("faturali");
  const featuredPhones = phones.slice(0, 4);
  const filteredPackages = useMemo(() => allPackages.filter((p: any) => p.category === pkgFilter).slice(0, 4), [allPackages, pkgFilter]);
  const featuredAccessories = allAccessories.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004899]/90 via-[#004899]/75 to-[#004899]/40" />
        </div>
        <div className="relative container py-20 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#FFD200] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Türkcell Yetkili Bayi</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-[Poppins] leading-tight mb-6">
              En Yeni Telefonlar,{" "}
              <span className="text-[#FFD200]">En Avantajlı</span>{" "}
              Paketler
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Göksoylar İletişim güvencesiyle en güncel akıllı telefonlar ve Türkcell tarifeleri, taksit imkanı ve ücretsiz kargo avantajıyla.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link
                href="/telefonlar"
                className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl text-sm"
              >
                <Smartphone className="w-5 h-5" />
                Telefonları İncele
              </Link>
              <Link
                href="/paketler"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/25 transition-all border border-white/20 text-sm"
              >
                <Signal className="w-5 h-5" />
                Paketleri Gör
              </Link>
            </motion.div>
          </motion.div>
        </div>
        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 20 1380 15L1440 10V80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="py-6 border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Ücretsiz Kargo", desc: "500 TL üzeri siparişlerde" },
              { icon: Shield, label: "Güvenli Alışveriş", desc: "256-bit SSL şifreleme" },
              { icon: Wifi, label: "Turkcell Bayisi", desc: "Yetkili bayi güvencesi" },
              { icon: Star, label: "12 Ay Taksit", desc: "Tüm kredi kartlarına" },
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

      {/* ===== TELEFONLAR ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[#FFD200] font-semibold text-sm tracking-wider uppercase mb-2 block">Cep Telefonları</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#004899] font-[Poppins]">Öne Çıkan Modeller</h2>
              </div>
              <Link href="/telefonlar" className="hidden md:flex items-center gap-1.5 text-[#004899] font-semibold text-sm hover:gap-3 transition-all">
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPhones.map((phone) => (
                <motion.div key={phone.id} variants={fadeInUp}>
                  <PhoneCard phone={phone} />
                </motion.div>
              ))}
            </div>

            <div className="md:hidden mt-8 text-center">
              <Link href="/telefonlar" className="inline-flex items-center gap-2 text-[#004899] font-semibold text-sm">
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WAVE DIVIDER ===== */}
      <div className="relative -mb-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 30L60 35C120 40 240 50 360 50C480 50 600 40 720 35C840 30 960 30 1080 35C1200 40 1320 50 1380 55L1440 60V80H0V30Z" fill="#F0F6FF" />
        </svg>
      </div>

      {/* ===== TÜRKCELL PAKETLERİ ===== */}
      <section className="bg-[#F0F6FF] py-16 lg:py-20 relative">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="text-[#FFD200] font-semibold text-sm tracking-wider uppercase mb-2 block">Türkcell Tarifeler</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#004899] font-[Poppins] mb-4">Size Uygun Paketi Seçin</h2>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                Faturalı ve gençlere özel Türkcell paketleri ile ihtiyacınıza en uygun tarifeyi bulun.
              </p>
              {/* Filter Tabs */}
              <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
                {(["faturali", "genc"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPkgFilter(cat)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      pkgFilter === cat
                        ? "bg-[#004899] text-white shadow-md"
                        : "text-gray-600 hover:text-[#004899]"
                    }`}
                  >
                    {cat === "faturali" ? "Faturalı" : "Gençlere Özel"}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => (
                <motion.div key={pkg.id} variants={fadeInUp}>
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp} className="text-center mt-10">
              <Link
                href="/paketler"
                className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-md text-sm"
              >
                Tüm Paketleri Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== WAVE DIVIDER ===== */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto rotate-180">
          <path d="M0 30L60 35C120 40 240 50 360 50C480 50 600 40 720 35C840 30 960 30 1080 35C1200 40 1320 50 1380 55L1440 60V80H0V30Z" fill="#F0F6FF" />
        </svg>
      </div>

      {/* ===== AKSESUAR BANNER ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden mb-12">
              <img src={ACCESSORIES_IMG} alt="Aksesuarlar" className="w-full h-64 lg:h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#004899]/85 to-[#004899]/40 flex items-center">
                <div className="container">
                  <div className="max-w-lg">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins] mb-4">
                      Telefon Aksesuarları
                    </h2>
                    <p className="text-white/80 mb-6">
                      Kulaklık, kılıf, şarj cihazı ve daha fazlası. Telefonunuzu tamamlayın.
                    </p>
                    <Link
                      href="/aksesuarlar"
                      className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all text-sm"
                    >
                      Aksesuarları İncele <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredAccessories.map((acc) => (
                <motion.div key={acc.id} variants={fadeInUp}>
                  <AccessoryCard acc={acc} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== HAKKIMIZDA BANNER ===== */}
      <section className="relative overflow-hidden">
        <div className="relative -mb-1">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 50L60 45C120 40 240 30 360 30C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0V50Z" fill="#004899" />
          </svg>
        </div>
        <div className="bg-[#004899] py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#FFD200] font-semibold text-sm tracking-wider uppercase mb-3 block">Hakkımızda</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins] mb-6">
                  Göksoylar İletişim ile Tanışın
                </h2>
                <p className="text-white/80 leading-relaxed mb-6">
                  Yıllardır Türkcell Yetkili Bayisi olarak hizmet veren Göksoylar İletişim, müşterilerine en güncel teknoloji ürünlerini ve en avantajlı Türkcell paketlerini sunmaktadır. Profesyonel ekibimiz ve geniş ürün yelpazemizle sizlere en iyi hizmeti vermeyi amaçlıyoruz.
                </p>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { num: "10+", label: "Yıllık Deneyim" },
                    { num: "50K+", label: "Mutlu Müşteri" },
                    { num: "1000+", label: "Ürün Çeşidi" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-[#FFD200] text-2xl lg:text-3xl font-bold font-[Poppins]">{stat.num}</p>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/hakkimizda"
                  className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all text-sm"
                >
                  Daha Fazla Bilgi <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src={STORE_IMG}
                  alt="Göksoylar İletişim Mağaza"
                  className="rounded-2xl shadow-2xl w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute -bottom-4 -left-4 bg-[#FFD200] text-[#004899] rounded-xl px-5 py-3 shadow-lg">
                  <p className="font-bold font-[Poppins] text-lg">Türkcell</p>
                  <p className="text-sm font-medium">Yetkili Bayi</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div
          className="py-16 lg:py-20 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${WAVE_IMG})` }}
        >
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
          <div className="relative container text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold text-[#004899] font-[Poppins] mb-4">
                Hemen Başvurun
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 max-w-lg mx-auto mb-8">
                Numara taşıma, yeni hat veya cihaz alımı için mağazamızı ziyaret edin veya bizi arayın.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/905349777000?text=Merhaba%2C%20G%C3%B6ksoylar%20%C4%B0leti%C5%9Fim'den%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp ile Ulaşın
                </a>
                <a
                  href="tel:+905349777000"
                  className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg text-sm"
                >
                  <Globe className="w-5 h-5" />
                  0534 977 70 00
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ===== PHONE CARD ===== */
function PhoneCard({ phone }: { phone: any }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#004899]/20 transition-all duration-300">
      <div className="relative p-4 pb-0">
        {phone.badge && (
          <span className="absolute top-4 left-4 z-10 bg-[#FFD200] text-[#004899] text-xs font-bold px-3 py-1 rounded-full">
            {phone.badge}
          </span>
        )}
        <div className="aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden">
          <img
            src={phone.image}
            alt={phone.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <div className="p-4 pt-3">
        <p className="text-xs text-gray-400 font-medium mb-1">{phone.brand}</p>
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{phone.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{phone.storage} · {phone.color}</p>
        <div className="flex items-end justify-between">
          <div>
            {phone.oldPrice && (
              <span className="text-xs text-gray-400 line-through block">{formatPrice(phone.oldPrice)}</span>
            )}
            <span className="text-lg font-bold text-[#004899]">{formatPrice(phone.price)}</span>
          </div>
          {phone.installment && (
            <span className="text-[10px] text-[#004899] bg-[#004899]/8 px-2 py-1 rounded-md font-medium">
              {phone.installment}
            </span>
          )}
        </div>
        <a
          href={`https://wa.me/905349777000?text=${encodeURIComponent(`Merhaba, Göksoylar İletişim'den *${phone.name}* hakkında bilgi almak istiyorum.\n\n📱 Telefon: ${phone.name}\n💾 Depolama: ${phone.storage}\n🎨 Renk: ${phone.color}\n💰 Fiyat: ${formatPrice(phone.price)}\n\nSatın almak istiyorum.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp ile Sipariş
        </a>
      </div>
    </div>
  );
}

/* ===== PACKAGE CARD ===== */
function PackageCard({ pkg }: { pkg: any }) {
  return (
    <div className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
      pkg.popular ? "border-[#FFD200] shadow-lg ring-2 ring-[#FFD200]/30" : "border-gray-100 hover:border-[#004899]/20"
    }`}>
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD200] text-[#004899] text-xs font-bold px-4 py-1 rounded-full">
          Popüler
        </span>
      )}
      <h3 className="font-bold text-[#004899] font-[Poppins] text-lg mb-4">{pkg.name}</h3>
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#004899]/8 flex items-center justify-center">
            <Globe className="w-4 h-4 text-[#004899]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{pkg.internet}</p>
            <p className="text-xs text-gray-500">İnternet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#004899]/8 flex items-center justify-center">
            <Signal className="w-4 h-4 text-[#004899]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{pkg.minutes}</p>
            <p className="text-xs text-gray-500">Konuşma</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#004899]/8 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[#004899]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{pkg.sms}</p>
            <p className="text-xs text-gray-500">SMS</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-end gap-1 mb-4">
          <span className="text-3xl font-extrabold text-[#004899] font-[Poppins]">{pkg.price}</span>
          <span className="text-gray-500 text-sm mb-1">TL/ay</span>
        </div>
        <a
          href={`https://wa.me/905349777000?text=${encodeURIComponent(`Merhaba, Göksoylar İletişim'den *${pkg.name}* hakkında bilgi almak istiyorum.\n\n📦 Paket: ${pkg.name}\n🌐 İnternet: ${pkg.internet}\n📞 Konuşma: ${pkg.minutes}\n💬 SMS: ${pkg.sms}\n💰 Fiyat: ${pkg.price} TL/ay\n\nBaşvuru yapmak istiyorum.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${
            pkg.popular
              ? "bg-[#25D366] text-white hover:bg-[#20bd5a]"
              : "bg-[#004899] text-white hover:bg-[#003570]"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp ile Başvur
        </a>
      </div>
    </div>
  );
}

/* ===== ACCESSORY CARD ===== */
function AccessoryCard({ acc }: { acc: any }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={acc.image}
          alt={acc.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-0.5">{acc.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{acc.name}</h3>
        <p className="text-base font-bold text-[#004899]">{formatPrice(acc.price)}</p>
      </div>
    </div>
  );
}
