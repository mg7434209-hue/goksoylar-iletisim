import { trpc } from "@/lib/trpc";
import { Smartphone, Package, Headphones, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: phones } = trpc.phones.listAll.useQuery();
  const { data: packages } = trpc.packages.listAll.useQuery();
  const { data: accessories } = trpc.accessories.listAll.useQuery();

  const stats = [
    {
      label: "Toplam Telefon",
      value: phones?.length ?? 0,
      active: phones?.filter(p => p.isActive).length ?? 0,
      icon: Smartphone,
      color: "bg-blue-500",
    },
    {
      label: "Toplam Paket",
      value: packages?.length ?? 0,
      active: packages?.filter(p => p.isActive).length ?? 0,
      icon: Package,
      color: "bg-green-500",
    },
    {
      label: "Toplam Aksesuar",
      value: accessories?.length ?? 0,
      active: accessories?.filter(a => a.isActive).length ?? 0,
      icon: Headphones,
      color: "bg-purple-500",
    },
    {
      label: "Toplam Ürün",
      value: (phones?.length ?? 0) + (packages?.length ?? 0) + (accessories?.length ?? 0),
      active: (phones?.filter(p => p.isActive).length ?? 0) + (packages?.filter(p => p.isActive).length ?? 0) + (accessories?.filter(a => a.isActive).length ?? 0),
      icon: TrendingUp,
      color: "bg-[#004899]",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Admin Paneli</h1>
        <p className="text-gray-500 mt-1">Göksoylar İletişim ürün ve paket yönetimi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400 font-medium">{stat.active} aktif</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/admin/telefonlar" className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-[#004899]/30 hover:bg-[#004899]/5 transition-all">
            <Smartphone className="w-5 h-5 text-[#004899]" />
            <div>
              <p className="font-medium text-gray-800 text-sm">Telefon Yönetimi</p>
              <p className="text-xs text-gray-500">Ekle, düzenle, kaldır</p>
            </div>
          </a>
          <a href="/admin/paketler" className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all">
            <Package className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-800 text-sm">Paket Yönetimi</p>
              <p className="text-xs text-gray-500">Ekle, düzenle, kaldır</p>
            </div>
          </a>
          <a href="/admin/aksesuarlar" className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all">
            <Headphones className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-gray-800 text-sm">Aksesuar Yönetimi</p>
              <p className="text-xs text-gray-500">Ekle, düzenle, kaldır</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
