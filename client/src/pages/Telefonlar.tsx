/*
 * Göksoylar İletişim - Telefonlar Sayfası
 * Tüm cep telefonları, marka filtresi ve fiyat sıralaması
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { phones, phoneBrands, formatPrice } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PHONES_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-2_1771431362000_na1fn_cGhvbmVzLXNob3djYXNl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTJfMTc3MTQzMTM2MjAwMF9uYTFmbl9jR2h2Ym1WekxYTm9iM2RqWVhObC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mFOlkEzLwpFozxTfzQQSeh4dUu5M6D2gkYv8n9VrxWufb6RAFKVQQ79zWb0AYwG2ebrVp2OTn~Pz3Lez--83BnI297OW9pvdt8vHwFN0AkSh5zG84fJJwHNg908lECmgbTNQFAWqlPBUmIstK9YVqnYyAnc2MSvW32gJG~jAjeGlFmcMIhFjmx6f~ZZDXdhq2-qlKaM5h9LbgTxX2XTd1aBnqPMLd9AegJPUnBNqMyK-r~KzoUkzsIf6cQnJfmAsBSikyJmbVfYMxQBSprpo46ijJkO9KrZZRkXmgj3R2Ycsnf7J-CUNbGLMbl61aCfTsHW-y0E4Ry3AX5W~C3t3sw__";

type SortOption = "default" | "price-asc" | "price-desc";

export default function Telefonlar() {
  const [brand, setBrand] = useState("Tümü");
  const [sort, setSort] = useState<SortOption>("default");

  const filtered = useMemo(() => {
    let list = brand === "Tümü" ? [...phones] : phones.filter((p) => p.brand === brand);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [brand, sort]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="relative h-48 lg:h-56 overflow-hidden">
        <img src={PHONES_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004899]/90 to-[#004899]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins]">Cep Telefonları</h1>
            <p className="text-white/70 mt-2">En güncel modeller, en uygun fiyatlar</p>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-10 lg:py-14">
        <div className="container">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              {phoneBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    brand === b
                      ? "bg-[#004899] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm bg-gray-100 border-0 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#004899]"
              >
                <option value="default">Varsayılan</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((phone, i) => (
              <motion.div
                key={phone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
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
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{phone.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{phone.storage} · {phone.ram} RAM · {phone.color}</p>
                    <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                      <p>Ekran: {phone.screen}</p>
                      <p>Kamera: {phone.camera}</p>
                      <p>Batarya: {phone.battery}</p>
                    </div>
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
                    <button className="w-full mt-3 bg-[#004899] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#003570] transition-colors">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Bu filtreye uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
