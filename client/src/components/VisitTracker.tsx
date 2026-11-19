/*
 * Ziyaretçi sayacı - her sayfa görüntülemesini sunucuya bildirir.
 * Aynı tarayıcı günde bir kez "ziyaretçi" olarak sayılır (Türkiye saati).
 * Admin sayfaları sayılmaz.
 */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "gk_last_visit_day";

function istanbulDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isNewVisitorToday(): boolean {
  const today = istanbulDay();
  try {
    if (localStorage.getItem(STORAGE_KEY) === today) return false;
    localStorage.setItem(STORAGE_KEY, today);
    return true;
  } catch {
    // localStorage kapalıysa (gizli mod vb.) oturum başına bir kez say
    return true;
  }
}

export default function VisitTracker() {
  const [location] = useLocation();
  const utils = trpc.useUtils();
  const track = trpc.stats.track.useMutation({
    onSuccess: () => utils.stats.summary.invalidate(),
  });
  const lastTracked = useRef<string | null>(null);
  const sessionCounted = useRef(false);

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    if (lastTracked.current === location) return;
    lastTracked.current = location;

    let newVisitor = false;
    if (!sessionCounted.current) {
      sessionCounted.current = true;
      newVisitor = isNewVisitorToday();
    }
    track.mutate({ newVisitor });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return null;
}
