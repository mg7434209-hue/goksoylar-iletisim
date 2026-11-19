/*
 * Admin paneli - Ziyaretçi istatistikleri (son 30 gün)
 */
import { trpc } from "@/lib/trpc";
import { Eye, Users, CalendarDays, MousePointerClick } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("tr-TR");

function formatDay(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    weekday: "short",
    timeZone: "UTC",
  });
}

export default function AdminVisitStats() {
  const { data: summary } = trpc.stats.summary.useQuery();
  const { data: recent, isLoading } = trpc.stats.recent.useQuery({ days: 30 });

  const rows = recent ?? [];
  const last30Visitors = rows.reduce((sum, r) => sum + r.visitors, 0);
  const maxVisitors = Math.max(1, ...rows.map(r => r.visitors));

  const cards = [
    { label: "Bugünkü Ziyaretçi", value: summary?.todayVisitors ?? 0, sub: `${fmt(summary?.todayViews ?? 0)} sayfa görüntüleme`, icon: Eye, color: "bg-[#004899]" },
    { label: "Son 30 Gün", value: last30Visitors, sub: "tekil ziyaretçi (günlük)", icon: CalendarDays, color: "bg-green-500" },
    { label: "Toplam Ziyaretçi", value: summary?.totalVisitors ?? 0, sub: "sayaç başladığından beri", icon: Users, color: "bg-orange-500" },
    { label: "Toplam Görüntüleme", value: summary?.totalViews ?? 0, sub: "tüm sayfa görüntülemeleri", icon: MousePointerClick, color: "bg-purple-500" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ziyaretçi İstatistikleri</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(c => (
          <div key={c.label} className="rounded-lg border border-gray-100 p-4">
            <div className={`w-9 h-9 ${c.color} rounded-lg flex items-center justify-center mb-3`}>
              <c.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{fmt(c.value)}</p>
            <p className="text-sm text-gray-600">{c.label}</p>
            <p className="text-xs text-gray-400">{c.sub}</p>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">Son 30 gün</h3>
      {isLoading ? (
        <p className="text-sm text-gray-400">Yükleniyor…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">Henüz ziyaret kaydı yok. Site ziyaret edildikçe burada görünecek.</p>
      ) : (
        <div className="space-y-1.5">
          {rows.map(r => (
            <div key={r.day} className="flex items-center gap-3 text-sm">
              <span className="w-28 shrink-0 text-gray-500">{formatDay(r.day)}</span>
              <div className="flex-1 h-5 bg-gray-50 rounded">
                <div
                  className="h-5 bg-[#004899]/80 rounded"
                  style={{ width: `${(r.visitors / maxVisitors) * 100}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-gray-700">
                <strong>{fmt(r.visitors)}</strong>
                <span className="text-gray-400"> / {fmt(r.pageViews)}</span>
              </span>
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-2">Ziyaretçi / sayfa görüntüleme</p>
        </div>
      )}
    </div>
  );
}
