/*
 * Footer'da gösterilen ziyaretçi sayacı.
 */
import { Eye, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

const fmt = (n: number) => n.toLocaleString("tr-TR");

export default function VisitorCounter() {
  const { data } = trpc.stats.summary.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  if (!data || data.totalVisitors === 0) return null;

  return (
    <div className="flex items-center gap-4 text-gray-400 text-sm" aria-label="Ziyaretçi sayacı">
      <span className="inline-flex items-center gap-1.5">
        <Eye className="w-4 h-4 text-[#FFD200]" />
        Bugün: <strong className="text-white font-semibold">{fmt(data.todayVisitors)}</strong>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Users className="w-4 h-4 text-[#FFD200]" />
        Toplam ziyaretçi: <strong className="text-white font-semibold">{fmt(data.totalVisitors)}</strong>
      </span>
    </div>
  );
}
