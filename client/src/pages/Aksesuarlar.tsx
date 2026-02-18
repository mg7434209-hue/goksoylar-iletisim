/*
 * Göksoylar İletişim - Aksesuarlar Sayfası
 */
import { motion } from "framer-motion";
import { accessories as staticAccessories, formatPrice } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ACCESSORIES_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-4_1771431374000_na1fn_YWNjZXNzb3JpZXMtYmFubmVy.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTRfMTc3MTQzMTM3NDAwMF9uYTFmbl9ZV05qWlhOemIzSnBaWE10WW1GdWJtVnkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OoLyDYsu8vTerngtk6TW45JN-K0ZTyERCiAUSK3XuoajpzddA6JbjXLX2CvwSuKUPZMTvvWE3TgLJN7JCEOkZhSQoD~yf0h0XG6doTsnjRwFbKhvmYGpSLRw0GKZ5cwwkiAaDjp~qqB7OJ53sph88LdUFqDq7I3XEolcYLuFE9Qprp0wW-O1~aqbyha~fpWEylAWjjPV3sR2KksVF--Nh8sLlnLvCiyXdZ9GWO3ohsWg6pGxcf0b5Q4hwnk0sE0UTctHwBPoPTO20--k2TGU1YbbOKlGBkAq9qc7nYFFlVNFhvY6btisd1z28MjcpAoEPvv5b-TQEVJXEpPsEHmoTA__";

export default function Aksesuarlar() {
  const { data: dbAccessories } = trpc.accessories.list.useQuery();
  const accessories = dbAccessories && dbAccessories.length > 0 ? dbAccessories : staticAccessories;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="relative h-48 lg:h-56 overflow-hidden">
        <img src={ACCESSORIES_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004899]/85 to-[#004899]/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins]">Aksesuarlar</h1>
            <p className="text-white/70 mt-2">Kulaklık, kılıf, şarj cihazı ve daha fazlası</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {accessories.map((acc, i) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#004899]/20 transition-all duration-300">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={acc.image}
                      alt={acc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-[#004899] bg-[#004899]/8 px-2 py-0.5 rounded font-medium">
                      {acc.category}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">{acc.brand}</p>
                    <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2">{acc.name}</h3>
                    <p className="text-lg font-bold text-[#004899] mt-2">{formatPrice(acc.price)}</p>
                    <button className="w-full mt-3 bg-[#004899] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#003570] transition-colors">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
