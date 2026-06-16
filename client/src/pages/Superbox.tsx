import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import {
  Wifi, Zap, Shield, Clock, CheckCircle, Loader2, MessageCircle, Phone, X, User, MapPin
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUPERBOX_BANNER = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187992687/jsBOdYhjHOlPWORa.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const features = [
  { icon: Shield, text: "Alt Yapı Derdi Yok", desc: "Fiber altyapı gerektirmez" },
  { icon: Zap, text: "Tek Priz Yeterli", desc: "Tak ve kullanmaya başla" },
  { icon: Clock, text: "12 Ay Sabit Fiyat", desc: "Fiyat değişikliği yok" },
  { icon: CheckCircle, text: "Aşım Derdi Yok", desc: "Kotanız bitince hız düşer" },
];

// Turkcell mavisi — 5G paketleri için ayrılmış renk
const turkcellGradient = "from-[#004899] to-[#0066cc]";
const turkcellBorder = "border-[#004899]/30 hover:border-[#004899]";

// 5G olmayan (4.5G) paketler için farklı renkler
const cardGradients = [
  "from-red-500 to-red-700",
  "from-purple-500 to-purple-700",
  "from-amber-500 to-amber-700",
  "from-emerald-500 to-emerald-700",
];

const cardBorders = [
  "border-red-200 hover:border-red-400",
  "border-purple-200 hover:border-purple-400",
  "border-amber-200 hover:border-amber-400",
  "border-emerald-200 hover:border-emerald-400",
];

/* ===== BAŞVURU FORMU MODALI ===== */
function ApplicationModal({
  isOpen,
  onClose,
  selectedPackage,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: { name: string; quota: string; price: number } | null;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; phone?: string; address?: string } = {};
    if (!formData.name.trim()) newErrors.name = "İsim alanı zorunludur";
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası zorunludur";
    } else if (!/^[0-9\s\-\+\(\)]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz";
    }
    if (!formData.address.trim()) newErrors.address = "Adres alanı zorunludur";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !selectedPackage) return;

    const message = encodeURIComponent(
      `Merhaba, Göksoylar İletişim'den *${selectedPackage.name}* için başvuru yapmak istiyorum.\n\n` +
      `📦 Paket: ${selectedPackage.name}\n` +
      `📶 Kota: ${selectedPackage.quota}\n` +
      `💰 Fiyat: ${selectedPackage.price.toLocaleString("tr-TR")} TL/ay\n` +
      `⏱ Taahhüt: 12 Ay\n\n` +
      `👤 İsim: ${formData.name}\n` +
      `📞 Telefon: ${formData.phone}\n` +
      `📍 Adres: ${formData.address}`
    );

    window.open(`https://wa.me/905349777000?text=${message}`, "_blank");
    onClose();
    setFormData({ name: "", phone: "", address: "" });
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: "", phone: "", address: "" });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#004899] to-[#002244] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg font-[Poppins]">Superbox Başvuru</h3>
                  {selectedPackage && (
                    <p className="text-white/70 text-sm mt-0.5">
                      {selectedPackage.name} - {selectedPackage.quota} - {selectedPackage.price.toLocaleString("tr-TR")} TL/ay
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-500 text-sm mb-2">
                Bilgilerinizi doldurun, WhatsApp üzerinden başvurunuzu iletelim.
              </p>

              {/* İsim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#004899]" />
                    Ad Soyad
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Adınız ve soyadınız"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  } focus:outline-none focus:ring-2 focus:ring-[#004899]/30 focus:border-[#004899] transition-all text-sm`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#004899]" />
                    Telefon Numarası
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  } focus:outline-none focus:ring-2 focus:ring-[#004899]/30 focus:border-[#004899] transition-all text-sm`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#004899]" />
                    Adres
                  </span>
                </label>
                <textarea
                  placeholder="Kurulum yapılacak adresiniz"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  } focus:outline-none focus:ring-2 focus:ring-[#004899]/30 focus:border-[#004899] transition-all text-sm resize-none`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/25 text-sm mt-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ile Gönder
              </button>

              <p className="text-gray-400 text-[11px] text-center">
                Bilgileriniz sadece başvuru amacıyla kullanılacaktır.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===== ANA SAYFA ===== */
export default function Superbox() {
  const { data: superboxList, isLoading } = trpc.superbox.list.useQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<{ name: string; quota: string; price: number } | null>(null);

  const openModal = (pkg: any) => {
    setSelectedPkg({ name: pkg.name, quota: pkg.quota, price: pkg.price });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d2147] to-[#1a0a3e]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative container py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/10">
                <Wifi className="w-4 h-4 text-[#FFD200]" />
                <span className="text-white/90 text-sm font-medium">Turkcell Superbox</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-[Poppins] leading-tight mb-6">
                Taşınabilir{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD200] to-yellow-300">
                  Ev İnterneti
                </span>
              </h1>

              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-lg">
                Fiber altyapı gerektirmeden, sadece bir prize takarak evinizde yüksek hızlı internet deneyimi yaşayın. 12 ay sabit fiyat garantisi ile.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 bg-white/8 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#FFD200]/15 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-[#FFD200]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{f.text}</p>
                      <p className="text-white/50 text-[11px]">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedPkg(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/30 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ile Bilgi Al
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <img
                src={SUPERBOX_BANNER}
                alt="Turkcell Superbox Taşınabilir Ev İnterneti"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 20 1380 15L1440 10V80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#004899] font-[Poppins] mb-4">
              Superbox Paketleri
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              İhtiyacınıza uygun paketi seçin, hemen başvurun. 12 ay boyunca sabit fiyat garantisi.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#004899] animate-spin" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {superboxList?.map((pkg: any, index: number) => (
                <motion.div key={pkg.id} variants={fadeInUp}>
                  <SuperboxCard pkg={pkg} index={index} onApply={openModal} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#004899] font-[Poppins] mb-3">
              Nasıl Çalışır?
            </h2>
            <p className="text-gray-500">3 kolay adımda internete bağlanın</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Paketinizi Seçin", desc: "Size uygun Superbox paketini belirleyin" },
              { step: "2", title: "Cihazı Takın", desc: "Superbox cihazını tek bir prize takın" },
              { step: "3", title: "İnternete Bağlanın", desc: "Wi-Fi ile tüm cihazlarınızdan bağlanın" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#004899] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#004899]/20">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#004899] to-[#002244]">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins] mb-4">
            Hemen Başvurun
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Superbox başvurunuz için bilgi formunu doldurun, WhatsApp üzerinden size ulaşalım.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSelectedPkg(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile Başvur
            </button>
            <a
              href="tel:+905349777000"
              className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg text-sm"
            >
              <Phone className="w-5 h-5" />
              0534 977 70 00
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Başvuru Formu Modalı */}
      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPackage={selectedPkg}
      />
    </div>
  );
}

/* ===== SUPERBOX CARD ===== */
function SuperboxCard({ pkg, index, onApply }: { pkg: any; index: number; onApply: (pkg: any) => void }) {
  // "5G Hazır" paketleri 5G'dir; geri kalanı 4.5G
  const is5G =
    pkg.category === "5g-hazir" ||
    pkg.speed === "5G" ||
    (pkg.name ?? "").includes("5G Hazır");
  const speedLabel = is5G ? "5G" : (pkg.speed ?? "4.5G");
  const gradient = is5G ? turkcellGradient : cardGradients[index % cardGradients.length];
  const border = is5G ? turkcellBorder : cardBorders[index % cardBorders.length];

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
      pkg.popular ? "border-[#FFD200] shadow-xl ring-2 ring-[#FFD200]/30" : border
    }`}>
      {pkg.popular && (
        <div className="absolute -top-0 left-0 right-0 bg-[#FFD200] text-[#004899] text-xs font-bold text-center py-1.5">
          En Popüler
        </div>
      )}

      {/* Gradient Header */}
      <div className={`bg-gradient-to-br ${gradient} px-6 py-8 ${pkg.popular ? "pt-10" : ""}`}>
        <div className="text-center">
          <Wifi className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg font-[Poppins] mb-1">{pkg.name}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/70 text-sm">{speedLabel} Hızında</span>
          </div>
        </div>
      </div>

      {/* Quota Badge */}
      <div className="flex justify-center -mt-5">
        <div className={`bg-gradient-to-r ${gradient} text-white font-extrabold text-2xl px-8 py-2.5 rounded-full shadow-lg font-[Poppins]`}>
          {pkg.quota}
        </div>
      </div>

      {/* Details */}
      <div className="px-6 pt-6 pb-6">
        <div className="space-y-3 mb-6">
          {[
            "Alt yapı derdi yok",
            "Tek priz yeterli",
            "12 ay sabit fiyat",
            "Aşım derdi yok",
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-gray-600 text-sm">{feat}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center border-t border-gray-100 pt-5 mb-5">
          <div className="flex items-end justify-center gap-1">
            <span className="text-4xl font-extrabold text-[#004899] font-[Poppins]">
              {pkg.price.toLocaleString("tr-TR")}
            </span>
            <span className="text-gray-500 text-sm mb-1.5">TL/ay</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">12 Ay Taahhüt</p>
        </div>

        {/* WhatsApp CTA - Form açar */}
        <button
          onClick={() => onApply(pkg)}
          className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all ${
            pkg.popular
              ? "bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/25"
              : "bg-[#004899] text-white hover:bg-[#003570]"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp ile Başvur
        </button>
      </div>
    </div>
  );
}
