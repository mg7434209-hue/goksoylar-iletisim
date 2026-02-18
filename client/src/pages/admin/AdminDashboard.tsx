import { trpc } from "@/lib/trpc";
import { Smartphone, Package, Headphones, TrendingUp, Wifi, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: phones, isLoading: phonesLoading } = trpc.phones.listAll.useQuery();
  const { data: packages, isLoading: packagesLoading } = trpc.packages.listAll.useQuery();
  const { data: accessories, isLoading: accessoriesLoading } = trpc.accessories.listAll.useQuery();
  const { data: superbox, isLoading: superboxLoading } = trpc.superbox.listAll.useQuery();

  const isLoading = phonesLoading || packagesLoading || accessoriesLoading || superboxLoading;

  const stats = [
    {
      label: "Toplam Telefon",
      value: phones?.length ?? 0,
      active: phones?.filter((p: any) => p.isActive).length ?? 0,
      icon: Smartphone,
      color: "bg-blue-500",
      href: "/admin/telefonlar",
    },
    {
      label: "Toplam Paket",
      value: packages?.length ?? 0,
      active: packages?.filter((p: any) => p.isActive).length ?? 0,
      icon: Package,
      color: "bg-green-500",
      href: "/admin/paketler",
    },
    {
      label: "Superbox Paketleri",
      value: superbox?.length ?? 0,
      active: superbox?.filter((s: any) => s.isActive).length ?? 0,
      icon: Wifi,
      color: "bg-orange-500",
      href: "/admin/superbox",
    },
    {
      label: "Toplam Aksesuar",
      value: accessories?.length ?? 0,
      active: accessories?.filter((a: any) => a.isActive).length ?? 0,
      icon: Headphones,
      color: "bg-purple-500",
      href: "/admin/aksesuarlar",
    },
    {
      label: "Toplam Ürün",
      value: (phones?.length ?? 0) + (packages?.length ?? 0) + (accessories?.length ?? 0) + (superbox?.length ?? 0),
      active:
        (phones?.filter((p: any) => p.isActive).length ?? 0) +
        (packages?.filter((p: any) => p.isActive).length ?? 0) +
        (accessories?.filter((a: any) => a.isActive).length ?? 0) +
        (superbox?.filter((s: any) => s.isActive).length ?? 0),
      icon: TrendingUp,
      color: "bg-[#004899]",
      href: "/admin",
    },
  ];

  const quickActions = [
    { icon: Smartphone, label: "Telefon Yönetimi", desc: "Ekle, düzenle, kaldır", href: "/admin/telefonlar", hoverBorder: "hover:border-blue-300", hoverBg: "hover:bg-blue-50", iconColor: "text-blue-600" },
    { icon: Package, label: "Paket Yönetimi", desc: "Ekle, düzenle, kaldır", href: "/admin/paketler", hoverBorder: "hover:border-green-300", hoverBg: "hover:bg-green-50", iconColor: "text-green-600" },
    { icon: Wifi, label: "Superbox Yönetimi", desc: "Ekle, düzenle, kaldır", href: "/admin/superbox", hoverBorder: "hover:border-orange-300", hoverBg: "hover:bg-orange-50", iconColor: "text-orange-600" },
    { icon: Headphones, label: "Aksesuar Yönetimi", desc: "Ekle, düzenle, kaldır", href: "/admin/aksesuarlar", hoverBorder: "hover:border-purple-300", hoverBg: "hover:bg-purple-50", iconColor: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Admin Paneli</h1>
        <p className="text-gray-500 mt-1">Göksoylar İletişim ürün ve paket yönetimi</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="w-12 h-4 bg-gray-200 rounded" />
              </div>
              <div className="w-8 h-7 bg-gray-200 rounded mb-1" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{stat.active} aktif</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#004899] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`flex items-center gap-3 p-4 rounded-lg border border-gray-100 ${action.hoverBorder} ${action.hoverBg} transition-all cursor-pointer`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
