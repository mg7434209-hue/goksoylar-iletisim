/*
 * Admin paneli - İletişim formundan gelen mesajlar
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, MailOpen, Phone, Trash2, MessageCircle, Inbox } from "lucide-react";

const SUBJECTS: Record<string, string> = {
  telefon: "Telefon Satın Alma",
  paket: "Paket Bilgisi",
  "numara-tasima": "Numara Taşıma",
  aksesuar: "Aksesuar Bilgisi",
  teknik: "Teknik Destek",
  diger: "Diğer",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("tr-TR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}

/** 05xx... → 905xx... (WhatsApp linki için) */
function waNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "9" + digits;
  else if (digits.length === 10) digits = "90" + digits;
  return digits;
}

export default function AdminMessages() {
  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.messages.list.useQuery();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const refresh = () => {
    utils.messages.list.invalidate();
    utils.messages.unreadCount.invalidate();
  };
  const setRead = trpc.messages.setRead.useMutation({ onSuccess: refresh });
  const remove = trpc.messages.delete.useMutation({
    onSuccess: () => { toast.success("Mesaj silindi"); refresh(); },
    onError: () => toast.error("Mesaj silinemedi"),
  });

  const all = messages ?? [];
  const unread = all.filter(m => !m.isRead).length;
  const shown = filter === "unread" ? all.filter(m => !m.isRead) : all;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Mesajlar</h1>
          <p className="text-gray-500 mt-1">İletişim formundan gelen mesajlar · {unread} okunmamış</p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1">
          {(["all", "unread"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === f ? "bg-[#004899] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {f === "all" ? `Tümü (${all.length})` : `Okunmamış (${unread})`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : shown.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{filter === "unread" ? "Okunmamış mesaj yok." : "Henüz mesaj yok."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(m => (
            <div
              key={m.id}
              className={`bg-white rounded-xl border p-5 shadow-sm ${m.isRead ? "border-gray-100" : "border-[#004899]/30 ring-1 ring-[#004899]/10"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!m.isRead && <span className="w-2 h-2 rounded-full bg-[#004899]" aria-label="Okunmamış" />}
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {SUBJECTS[m.subject] ?? m.subject}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(m.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRead.mutate({ id: m.id, isRead: !m.isRead })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-100"
                  >
                    {m.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                    {m.isRead ? "Okunmadı yap" : "Okundu"}
                  </button>
                  <button
                    onClick={() => { if (confirm(`${m.name} adlı kişinin mesajı silinsin mi?`)) remove.mutate({ id: m.id }); }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    aria-label="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words mb-4">{m.message}</p>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004899]/5 text-[#004899] hover:bg-[#004899]/10">
                  <Phone className="w-3.5 h-3.5" /> {m.phone}
                </a>
                <a href={`https://wa.me/${waNumber(m.phone)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                {m.email && (
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100">
                    <Mail className="w-3.5 h-3.5" /> {m.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
