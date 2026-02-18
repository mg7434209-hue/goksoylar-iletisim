/*
 * Göksoylar İletişim - Hakkımızda Sayfası
 * Design: Digital Wave - Turkcell Blue/Yellow
 */
import { motion } from "framer-motion";
import { Shield, Award, Users, Headphones, CheckCircle, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STORE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-5_1771431363000_na1fn_c3RvcmUtZnJvbnQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTVfMTc3MTQzMTM2MzAwMF9uYTFmbl9jM1J2Y21VdFpuSnZiblEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PuPJsSOEHlIvYhFWZSvel~Z0fIBo21qXN0EDJDnOSQ4vqG4Ckdn-RZ4OdI1EhZkskqB3n4IfDmGGZJ-NEGtBkZUh7G0UMz5d5Vubz5aOpHOWdlxyfLnLydF9c9rwVNvxT3hgigA~xcyO6gW2klhgrHSZXx8B2XbSSgVcTCdknJI9BrYsvsiUmIikb6lEYlWzGqUP4CX0VL6SWhLBykKNuzJdWn8uXM1TY~guXMKG0oEBDeW4Gpl0GLjrQt6cHNepayukRg1~8J7MjOPp59ThDaZysMgVYHktCB1un4pIJC5yR6TWSVYl2Ne1UILt-28zt7Fyps1mKsvOB1TNzlbkZA__";

const HERO_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/tQpG3h77LNb9xnBdLSPrmV/sandbox/fmmkiuE8pWZTDTPaZGMZLX-img-1_1771431375000_na1fn_aGVyby1iYW5uZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdFFwRzNoNzdMTmI5eG5CZExTUHJtVi9zYW5kYm94L2ZtbWtpdUU4cFdaVERUUGFaR01aTFgtaW1nLTFfMTc3MTQzMTM3NTAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TG1VDMJ4j2IUlIEKeffMA7Vbnlc5uOSFmDWNOUe3aDk4yfzEzmdYoZ~fQDG0aTO2rUViDYmzxCAxGCHbcgw4uhXLjiS34QpDSeu7MEvMN0Q67mVZCKKkxI1dyzxz7-DO7G~SyrBzdXKCsiKX~r3o8OvzFEQHTbhchmlHLpTHgPbeYfn6BmKY7R2tGGUlOW5qJ9lF2DXW~8ItDRIASNwhLBlyIHRPVdOTtYEGx9gNWzdDq-wwdyS7vK059XeuH-4tHub7qpeyRZCJ9hzjwNdh-TVuR0HbfChzWXkxNS~TNK4z0q9RCyndAuL0wcTU1~1mCxqAz2InZduflWjF0pMrKQ__";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Hakkimizda() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="relative h-48 lg:h-56 overflow-hidden">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004899]/90 to-[#004899]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins]">Hakkımızda</h1>
            <p className="text-white/70 mt-2">Göksoylar İletişim'i yakından tanıyın</p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="text-[#FFD200] font-semibold text-sm tracking-wider uppercase mb-3 block">Biz Kimiz?</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#004899] font-[Poppins] mb-6">
                Güvenilir Türkcell Bayiniz
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Göksoylar İletişim, 10 yılı aşkın süredir Türkcell Yetkili Bayisi olarak hizmet vermektedir. Müşteri memnuniyetini ön planda tutarak, en güncel akıllı telefonları, Türkcell paketlerini ve telefon aksesuarlarını uygun fiyatlarla sunmaktayız.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Profesyonel ve deneyimli ekibimiz, numara taşıma işlemlerinden cihaz seçimine, tarife danışmanlığından teknik desteğe kadar her aşamada yanınızda. Amacımız, teknoloji dünyasındaki en iyi hizmeti sizlere sunmaktır.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Geniş ürün yelpazemiz, taksit imkanlarımız ve satış sonrası destek hizmetlerimizle sektörde fark yaratıyoruz. Göksoylar İletişim olarak, her zaman müşterilerimizin güvenini kazanmayı ve korumayı hedefliyoruz.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <img
                src={STORE_IMG}
                alt="Göksoylar İletişim Mağaza"
                className="rounded-2xl shadow-xl w-full h-80 lg:h-[420px] object-cover"
              />
              <div className="absolute -bottom-5 -right-5 bg-[#004899] text-white rounded-2xl p-6 shadow-xl hidden lg:block">
                <p className="text-3xl font-extrabold font-[Poppins] text-[#FFD200]">10+</p>
                <p className="text-sm text-white/80">Yıllık Deneyim</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#004899] py-14">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "10+", label: "Yıllık Deneyim", icon: Award },
              { num: "50.000+", label: "Mutlu Müşteri", icon: Users },
              { num: "1.000+", label: "Ürün Çeşidi", icon: Target },
              { num: "7/24", label: "Müşteri Desteği", icon: Headphones },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-[#FFD200]" />
                </div>
                <p className="text-3xl lg:text-4xl font-extrabold text-white font-[Poppins] mb-1">{stat.num}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="text-[#FFD200] font-semibold text-sm tracking-wider uppercase mb-2 block">Değerlerimiz</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#004899] font-[Poppins]">Neden Göksoylar İletişim?</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Yetkili Bayi Güvencesi",
                  desc: "Türkcell Yetkili Bayisi olarak tüm ürün ve hizmetlerimiz resmi garanti kapsamındadır.",
                },
                {
                  icon: Award,
                  title: "Kaliteli Hizmet",
                  desc: "Deneyimli ekibimiz ile satış öncesi ve sonrası profesyonel destek sunuyoruz.",
                },
                {
                  icon: Users,
                  title: "Müşteri Odaklı",
                  desc: "Her müşterimize özel çözümler üreterek memnuniyeti en üst düzeyde tutuyoruz.",
                },
                {
                  icon: CheckCircle,
                  title: "Geniş Ürün Yelpazesi",
                  desc: "Apple, Samsung, Xiaomi ve daha birçok markanın en güncel modellerini bulabilirsiniz.",
                },
                {
                  icon: Target,
                  title: "Uygun Fiyat Politikası",
                  desc: "Rekabetçi fiyatlarımız ve taksit seçeneklerimizle bütçenize uygun çözümler.",
                },
                {
                  icon: Headphones,
                  title: "Teknik Destek",
                  desc: "Cihaz kurulumu, veri aktarımı ve teknik sorunlarınızda yanınızdayız.",
                },
              ].map((value, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-[#004899]/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#004899]/8 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#004899]" />
                  </div>
                  <h3 className="font-bold text-gray-800 font-[Poppins] text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
