/*
 * Göksoylar İletişim - Navbar
 * Design: Digital Wave - Turkcell Blue (#004899) sticky header
 * Font: Poppins headings, DM Sans body
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ShoppingBag, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/telefonlar", label: "Telefonlar" },
  { href: "/paketler", label: "Türkcell Paketler" },
  { href: "/superbox", label: "Superbox" },
  { href: "/aksesuarlar", label: "Aksesuarlar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#004899] text-white text-sm py-2">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+905349777000" className="flex items-center gap-1.5 hover:text-[#FFD200] transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">0534 977 70 00</span>
            </a>
            <span className="hidden md:inline text-white/60">|</span>
            <span className="hidden md:inline text-white/80">Türkcell Yetkili Bayi</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#FFD200] font-medium text-xs sm:text-sm">Ücretsiz Kargo &amp; 12 Taksit</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#004899] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-[#FFD200] font-bold text-lg font-[Poppins]">G</span>
            </div>
            <div className="leading-tight">
              <span className="text-[#004899] font-bold text-base lg:text-lg font-[Poppins] block">Göksoylar</span>
              <span className="text-gray-500 text-[10px] lg:text-xs tracking-wide">İLETİŞİM</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location === link.href
                    ? "bg-[#004899]/10 text-[#004899]"
                    : "text-gray-600 hover:text-[#004899] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600" aria-label="Ara">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 relative" aria-label="Sepet">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#FFD200] text-[#004899] text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button
              className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <nav className="container py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location === link.href
                        ? "bg-[#004899] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
