import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SuperboxForm = {
  slug: string; name: string; category: string; speed: string;
  quota: string; commitment: string; price: number;
  bonus: string; bonusDetail: string;
  isOnlineExclusive: boolean; popular: boolean;
  isActive: boolean; sortOrder: number;
};

const emptyForm: SuperboxForm = {
  slug: "", name: "", category: "devam", speed: "4.5G",
  quota: "", commitment: "12 Ay", price: 0,
  bonus: "", bonusDetail: "",
  isOnlineExclusive: false, popular: false,
  isActive: true, sortOrder: 0,
};

const categoryLabels: Record<string, string> = {
  "5g-hazir": "5G'ye Hazır",
  "devam": "Ana Paket",
  "calistir-devam": "Çalıştır Devam",
  "dijitale-ozel": "Dijitale Özel",
  "4-5g": "4.5G",
};

const categoryColors: Record<string, string> = {
  "5g-hazir": "bg-purple-50 text-purple-700",
  "devam": "bg-blue-50 text-blue-700",
  "calistir-devam": "bg-teal-50 text-teal-700",
  "dijitale-ozel": "bg-amber-50 text-amber-700",
  "4-5g": "bg-green-50 text-green-700",
};

export default function AdminSuperbox() {
  const utils = trpc.useUtils();
  const { data: superboxList, isLoading } = trpc.superbox.listAll.useQuery();
  const createMutation = trpc.superbox.create.useMutation({ onSuccess: () => { utils.superbox.listAll.invalidate(); toast.success("Superbox paketi eklendi"); setOpen(false); } });
  const updateMutation = trpc.superbox.update.useMutation({ onSuccess: () => { utils.superbox.listAll.invalidate(); toast.success("Superbox paketi güncellendi"); setOpen(false); } });
  const deleteMutation = trpc.superbox.delete.useMutation({ onSuccess: () => { utils.superbox.listAll.invalidate(); toast.success("Superbox paketi silindi"); setDeleteId(null); } });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<SuperboxForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (pkg: any) => {
    setEditId(pkg.id);
    setForm({
      slug: pkg.slug, name: pkg.name, category: pkg.category,
      speed: pkg.speed, quota: pkg.quota, commitment: pkg.commitment,
      price: pkg.price, bonus: pkg.bonus || "", bonusDetail: pkg.bonusDetail || "",
      isOnlineExclusive: pkg.isOnlineExclusive, popular: pkg.popular,
      isActive: pkg.isActive, sortOrder: pkg.sortOrder,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.quota || !form.price) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, "-").replace(/(^-|-$)/g, "");
    const data = {
      ...form,
      slug,
      bonus: form.bonus || null,
      bonusDetail: form.bonusDetail || null,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Superbox Yönetimi</h1>
          <p className="text-gray-500 mt-1">{superboxList?.length ?? 0} paket kayıtlı</p>
        </div>
        <Button onClick={openCreate} className="bg-[#004899] hover:bg-[#003570]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Superbox Paketi
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Paket Adı</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kota</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Taahhüt</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Bonus</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {superboxList?.map((pkg: any) => (
                  <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{pkg.name}</span>
                        {pkg.popular && <span className="text-[10px] font-bold bg-[#FFD200] text-[#004899] px-2 py-0.5 rounded-full">Popüler</span>}
                        {pkg.isOnlineExclusive && <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Online</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[pkg.category] || "bg-gray-100 text-gray-600"}`}>
                        {categoryLabels[pkg.category] || pkg.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{pkg.quota}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.commitment}</td>
                    <td className="px-4 py-3 font-semibold text-[#004899]">{pkg.price.toLocaleString("tr-TR")} TL/ay</td>
                    <td className="px-4 py-3">
                      {(pkg.bonus || pkg.bonusDetail) ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                          <Gift className="w-3 h-3" /> {pkg.bonus || pkg.bonusDetail}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {pkg.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Aktif</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Pasif</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(pkg.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">{editId ? "Superbox Paketi Düzenle" : "Yeni Superbox Paketi Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Paket Adı *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Superbox Devam 500 GB" />
            </div>
            <div>
              <Label>Kategori *</Label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="5g-hazir">5G'ye Hazır</option>
                <option value="devam">Ana Paket (Devam)</option>
                <option value="calistir-devam">Çalıştır Devam</option>
                <option value="dijitale-ozel">Dijitale Özel</option>
                <option value="4-5g">4.5G Paketler</option>
              </select>
            </div>
            <div>
              <Label>Hız</Label>
              <Input value={form.speed} onChange={e => setForm({ ...form, speed: e.target.value })} placeholder="4.5G" />
            </div>
            <div>
              <Label>Kota *</Label>
              <Input value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })} placeholder="500 GB, 1 TB..." />
            </div>
            <div>
              <Label>Taahhüt</Label>
              <Input value={form.commitment} onChange={e => setForm({ ...form, commitment: e.target.value })} placeholder="12 Ay" />
            </div>
            <div>
              <Label>Fiyat (TL/ay) *</Label>
              <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Otomatik oluşturulur" />
            </div>
            <div className="col-span-2">
              <Label>Bonus (opsiyonel)</Label>
              <Input value={form.bonus} onChange={e => setForm({ ...form, bonus: e.target.value })} placeholder="50 GB Hediye" />
            </div>
            <div className="col-span-2">
              <Label>Bonus Detayı (opsiyonel)</Label>
              <Input value={form.bonusDetail} onChange={e => setForm({ ...form, bonusDetail: e.target.value })} placeholder="12 Ay Boyunca Her Ay Hediye" />
            </div>
            <div>
              <Label>Sıralama</Label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
                <Label>Aktif</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.popular} onCheckedChange={v => setForm({ ...form, popular: v })} />
                <Label>Popüler</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.isOnlineExclusive} onCheckedChange={v => setForm({ ...form, isOnlineExclusive: v })} />
                <Label>Online'a Özel</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
            <Button onClick={handleSubmit} className="bg-[#004899] hover:bg-[#003570]" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? "Kaydediliyor..." : editId ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Superbox Paketini Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu Superbox paketini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
