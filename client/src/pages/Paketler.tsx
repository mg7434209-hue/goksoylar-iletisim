/*
 * Göksoylar İletişim - Türkcell Paketler Sayfası
 * Tüm faturalı ve gençlere özel paketler
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Signal, MessageSquare, Check, Sparkles } from "lucide-react";
import { turkcellPackages } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WAVE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-3_1771431371000_na1fn_dHVya2NlbGwtcGFja2FnZXM.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTNfMTc3MTQzMTM3MTAwMF9uYTFmbl9kSFZ5YTJObGJHd3RjR0ZqYTJGblpYTS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=X5Lb~az1Yf600Uu~wN0~XbXCYCFe1Rz8XMB4cz04vxWZuVT9loPCXxnPyfxAGC29bRf2Xy5LdANr1hvEe12U1vB8-XbF4D~76bzaFKEKXz~Fx9Hwvmio1Bxocb0~NRMpH0y0gSXg~pl1p7YpE-ZYuU7bKY8tyccP5frCr-FL7uzKJQDUaicAI34AggrUZdWhRStJLFfd4G52P0-CT2aVMjqPwncsbUC3X7J3V5MJWbxZ7MjeH2UBqhwVMk1vFWHVC3-3d9NDt-g71tMmgc9jH8CYE~dTi2XZ2j1C2rSAdbB09YkwBHFg76zV9ut~tiusUdwBvVzPXFAZSdjad-6kYA__";

export default function Paketler() {
  const [category, setCategory] = useState<"faturali" | "genç">("faturali");
  const filtered = turkcellPackages.filter((p) => p.category === category);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="relative h-48 lg:h-56 overflow-hidden">
        <img src={WAVE_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004899]/85 to-[#004899]/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins]">Türkcell Paketler</h1>
            <p className="text-white/70 mt-2">Size en uygun Türkcell tarifesini seçin</p>
          </div>
        </div>
      </section>

      {/* Filter & Packages */}
      <section className="py-12 lg:py-16">
        <div className="container">
          {/* Category Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1.5">
              {(["faturali", "genç"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                    category === cat
                      ? "bg-[#004899] text-white shadow-md"
                      : "text-gray-600 hover:text-[#004899]"
                  }`}
                >
                  {cat === "faturali" ? "Faturalı Tarifeler" : "Gençlere Özel (GNÇ+)"}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                  pkg.popular ? "border-[#FFD200] shadow-lg ring-2 ring-[#FFD200]/30" : "border-gray-100 hover:border-[#004899]/20"
                }`}>
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD200] text-[#004899] text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popüler
                    </span>
                  )}
                  <h3 className="font-bold text-[#004899] font-[Poppins] text-lg mb-5">{pkg.name}</h3>

                  {/* Data */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#004899]/8 flex items-center justify-center shrink-0">
                        <Globe className="w-4.5 h-4.5 text-[#004899]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{pkg.internet}</p>
                        <p className="text-xs text-gray-500">İnternet</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#004899]/8 flex items-center justify-center shrink-0">
                        <Signal className="w-4.5 h-4.5 text-[#004899]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{pkg.minutes}</p>
                        <p className="text-xs text-gray-500">Konuşma</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#004899]/8 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4.5 h-4.5 text-[#004899]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{pkg.sms}</p>
                        <p className="text-xs text-gray-500">SMS</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {pkg.features && (
                    <div className="mb-5 flex-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dahil Özellikler</p>
                      <ul className="space-y-1.5">
                        {pkg.features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-[#004899] font-[Poppins]">{pkg.price}</span>
                      <span className="text-gray-500 text-sm mb-1">TL/ay</span>
                    </div>
                    <button className={`w-full text-sm font-semibold py-3 rounded-xl transition-colors ${
                      pkg.popular
                        ? "bg-[#FFD200] text-[#004899] hover:bg-yellow-300"
                        : "bg-[#004899] text-white hover:bg-[#003570]"
                    }`}>
                      Hemen Başvur
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-[#F0F6FF] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-[#004899] font-[Poppins] mb-3">Hangi Paket Size Uygun?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Doğru paketi seçmek için mağazamızı ziyaret edebilir veya bizi arayabilirsiniz. Uzman ekibimiz ihtiyacınıza en uygun Türkcell tarifesini bulmanıza yardımcı olacaktır.
            </p>
            <a
              href="tel:+905349777000"
              className="inline-flex items-center gap-2 bg-[#004899] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#003570] transition-all text-sm"
            >
              Bizi Arayın: 0534 977 70 00
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
