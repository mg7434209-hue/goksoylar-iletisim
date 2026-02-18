/*
 * Göksoylar İletişim - İletişim Sayfası
 * Design: Digital Wave - İletişim formu ve bilgiler
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Iletisim() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#004899] py-14 lg:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[#FFD200] blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative">
          <h1 className="text-3xl lg:text-4xl font-bold text-white font-[Poppins] mb-3">İletişim</h1>
          <p className="text-white/70 max-w-lg">
            Sorularınız, önerileriniz veya sipariş talepleriniz için bizimle iletişime geçin.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 30L80 25C160 20 320 10 480 15C640 20 800 40 960 45C1120 50 1280 40 1360 35L1440 30V60H0V30Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-5 gap-10"
          >
            {/* Contact Info */}
            <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#004899] font-[Poppins] mb-6">Bize Ulaşın</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Mağazamızı ziyaret edebilir, bizi arayabilir veya iletişim formunu doldurarak mesaj gönderebilirsiniz.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    title: "Adres",
                    content: "Atatürk Cad. No: 42, Merkez / İstanbul",
                    sub: "Mağazamız merkezi konumda, kolay ulaşılabilir.",
                  },
                  {
                    icon: Phone,
                    title: "Telefon",
                    content: "0500 123 45 67",
                    sub: "Hafta içi ve Cumartesi günleri arayabilirsiniz.",
                    href: "tel:+905001234567",
                  },
                  {
                    icon: Mail,
                    title: "E-posta",
                    content: "info@goksoylar.com",
                    sub: "24 saat içinde yanıt veriyoruz.",
                    href: "mailto:info@goksoylar.com",
                  },
                  {
                    icon: Clock,
                    title: "Çalışma Saatleri",
                    content: "Pzt - Cmt: 09:00 - 20:00",
                    sub: "Pazar günleri kapalıyız.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-[#F0F6FF] transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-[#004899]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#004899]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-0.5">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-[#004899] font-medium text-sm hover:underline">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-700 text-sm font-medium">{item.content}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">WhatsApp ile Ulaşın</h3>
                </div>
                <p className="text-green-700 text-sm mb-3">
                  Hızlı yanıt için WhatsApp üzerinden bize mesaj gönderebilirsiniz.
                </p>
                <a
                  href="https://wa.me/905001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Yazın
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp} className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <h3 className="text-xl font-bold text-[#004899] font-[Poppins] mb-6">Mesaj Gönderin</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ad Soyad *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#004899] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Telefon *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#004899] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">E-posta</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#004899] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Konu *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#004899] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="">Konu Seçin</option>
                      <option value="telefon">Telefon Satın Alma</option>
                      <option value="paket">Türkcell Paket Bilgisi</option>
                      <option value="numara-tasima">Numara Taşıma</option>
                      <option value="aksesuar">Aksesuar Bilgisi</option>
                      <option value="teknik">Teknik Destek</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mesajınız *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#004899] focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#FFD200] text-[#004899] font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-md text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Mesaj Gönder
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="pb-0">
        <div className="bg-gray-100 h-80 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-[#004899]/40 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Atatürk Cad. No: 42, Merkez / İstanbul</p>
            <p className="text-gray-400 text-xs mt-1">Harita görünümü</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
