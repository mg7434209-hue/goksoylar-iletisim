import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard, Smartphone, Package, Headphones, Wifi,
  LogOut, ArrowLeft, Menu, X, Lock, Eye, EyeOff, User
} from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

// Admin auth context
type AdminAuthState = {
  authenticated: boolean;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthState>({
  authenticated: false,
  username: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify admin session on mount
    fetch("/api/admin/verify", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuthenticated(true);
          setUsername(data.username);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (usr: string, pwd: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: usr, password: pwd }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        setUsername(data.username);
        return true;
      }
      toast.error(data.error || "Giriş başarısız");
      return false;
    } catch {
      toast.error("Sunucu bağlantı hatası");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setAuthenticated(false);
    setUsername(null);
  };

  return (
    <AdminAuthContext.Provider value={{ authenticated, username, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Login screen
function AdminLoginScreen() {
  const { login } = useAdminAuth();
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Kullanıcı adı ve şifre gereklidir");
      return;
    }
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (success) {
      toast.success("Giriş başarılı!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#004899]/5 via-white to-[#FFD200]/5">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#004899] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#004899]/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Admin Paneli</h1>
          <p className="text-gray-500 mt-1">Göksoylar İletişim Yönetim Sistemi</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Kullanıcı Adı
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Kullanıcı adınızı girin"
                  value={username}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-[#004899] focus:ring-[#004899]/20"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#004899] focus:ring-[#004899]/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#004899] hover:bg-[#003570] text-white font-medium text-sm"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </div>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link href="/">
            <span className="text-sm text-gray-500 hover:text-[#004899] transition-colors cursor-pointer inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Ana Sayfaya Dön
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Smartphone, label: "Telefonlar", path: "/admin/telefonlar" },
  { icon: Package, label: "Paketler", path: "/admin/paketler" },
  { icon: Wifi, label: "Superbox", path: "/admin/superbox" },
  { icon: Headphones, label: "Aksesuarlar", path: "/admin/aksesuarlar" },
];

function AdminPanel({ children }: { children: React.ReactNode }) {
  const { authenticated, username, loading, logout } = useAdminAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#004899] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#004899] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <p className="font-bold text-[#004899] text-sm font-[Poppins]">Göksoylar</p>
                <p className="text-[10px] text-gray-400">Admin Paneli</p>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#004899] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100">
            <Link href="/">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all cursor-pointer mb-1">
                <ArrowLeft className="w-4 h-4" />
                Siteye Dön
              </div>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
            <div className="mt-3 px-3">
              <p className="text-xs text-gray-400 truncate">{username || "Admin"}</p>
              <p className="text-[10px] text-gray-300">Yönetici</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-[#004899] text-sm font-[Poppins]">Admin Paneli</span>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminPanel>{children}</AdminPanel>
    </AdminAuthProvider>
  );
}
