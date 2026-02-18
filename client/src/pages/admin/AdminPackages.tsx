import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Search, Package as PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PackageForm = {
  slug: string; name: string; category: "faturali" | "faturasiz" | "genc";
  internet: string; minutes: string; sms: string; price: number;
  popular: boolean; features: string; isActive: boolean; sortOrder: number;
};

const emptyForm: PackageForm = {
  slug: "", name: "", category: "faturali",
  internet: "", minutes: "", sms: "", price: 0,
  popular: false, features: "", isActive: true, sortOrder: 0,
};

const categoryLabels: Record<string, string> = {
  faturali: "Faturalı",
  faturasiz: "Faturasız",
  genc: "GNÇ+",
};

export default function AdminPackages() {
  const utils = trpc.useUtils();
  const { data: packages, isLoading } = trpc.packages.listAll.useQuery();
  const createMutation = trpc.packages.create.useMutation({
    onSuccess: () => { utils.packages.listAll.invalidate(); toast.success("Paket başarıyla eklendi"); setOpen(false); },
    onError: (err) => { toast.error("Hata: " + (err.message || "Paket eklenemedi")); },
  });
  const updateMutation = trpc.packages.update.useMutation({
    onSuccess: () => { utils.packages.listAll.invalidate(); toast.success("Paket başarıyla güncellendi"); setOpen(false); },
    onError: (err) => { toast.error("Hata: " + (err.message || "Paket güncellenemedi")); },
  });
  const deleteMutation = trpc.packages.delete.useMutation({
    onSuccess: () => { utils.packages.listAll.invalidate(); toast.success("Paket başarıyla silindi"); setDeleteId(null); },
    onError: (err) => { toast.error("Hata: " + (err.message || "Paket silinemedi")); },
  });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = useMemo(() => {
    if (!packages) return [];
    if (!searchQuery.trim()) return packages;
    const q = searchQuery.toLowerCase();
    return packages.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      (categoryLabels[p.category] || p.category).toLowerCase().includes(q)
    );
  }, [packages, searchQuery]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (pkg: any) => {
    setEditId(pkg.id);
    setForm({
      slug: pkg.slug, name: pkg.name, category: pkg.category,
      internet: pkg.internet, minutes: pkg.minutes, sms: pkg.sms,
      price: pkg.price, popular: pkg.popular, features: pkg.features || "",
      isActive: pkg.isActive, sortOrder: pkg.sortOrder,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Paket adı zorunludur"); return; }
    if (!form.internet.trim()) { toast.error("İnternet bilgisi zorunludur"); return; }
    if (!form.minutes.trim()) { toast.error("Dakika bilgisi zorunludur"); return; }
    if (!form.sms.trim()) { toast.error("SMS bilgisi zorunludur"); return; }
    if (!form.price || form.price <= 0) { toast.error("Geçerli bir fiyat girin"); return; }

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const data = { ...form, slug, features: form.features || undefined };
    if (editId) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Paket Yönetimi</h1>
          <p className="text-gray-500 mt-1">{packages?.length ?? 0} paket kayıtlı</p>
        </div>
        <Button onClick={openCreate} className="bg-[#004899] hover:bg-[#003570]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Paket
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Paket adı veya kategori ile arayın..."
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-[#004899] rounded-full" />
            Yükleniyor...
          </div>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            {searchQuery ? "Sonuç bulunamadı" : "Henüz paket eklenmemiş"}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery ? `"${searchQuery}" aramasına uygun paket bulunamadı.` : "İlk paketi eklemek için yukarıdaki butonu kullanın."}
          </p>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>Aramayı Temizle</Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Paket Adı</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">İnternet</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Dakika</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">SMS</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPackages.map((pkg: any) => (
                  <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{pkg.name}</p>
                        {pkg.popular && <span className="text-[10px] font-bold bg-[#FFD200] text-[#004899] px-2 py-0.5 rounded-full">Popüler</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {categoryLabels[pkg.category] || pkg.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{pkg.internet}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.minutes}</td>
                    <td className="px-4 py-3 text-gray-600">{pkg.sms}</td>
                    <td className="px-4 py-3 font-semibold text-[#004899]">{pkg.price} TL/ay</td>
                    <td className="px-4 py-3">
                      {pkg.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Aktif</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Pasif</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)} title="Düzenle"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(pkg.id)} title="Sil"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {searchQuery && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              {filteredPackages.length} / {packages?.length} paket gösteriliyor
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">{editId ? "Paket Düzenle" : "Yeni Paket Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Paket Adı <span className="text-red-500">*</span></Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Star+ 15 GB" />
            </div>
            <div>
              <Label>Kategori <span className="text-red-500">*</span></Label>
              <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="faturali">Faturalı</SelectItem>
                  <SelectItem value="faturasiz">Faturasız</SelectItem>
                  <SelectItem value="genc">GNÇ+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Otomatik oluşturulur" />
            </div>
            <div>
              <Label>İnternet <span className="text-red-500">*</span></Label>
              <Input value={form.internet} onChange={e => setForm({ ...form, internet: e.target.value })} placeholder="15 GB" />
            </div>
            <div>
              <Label>Dakika <span className="text-red-500">*</span></Label>
              <Input value={form.minutes} onChange={e => setForm({ ...form, minutes: e.target.value })} placeholder="1000 dk" />
            </div>
            <div>
              <Label>SMS <span className="text-red-500">*</span></Label>
              <Input value={form.sms} onChange={e => setForm({ ...form, sms: e.target.value })} placeholder="250 SMS" />
            </div>
            <div>
              <Label>Fiyat (TL/ay) <span className="text-red-500">*</span></Label>
              <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="col-span-2">
              <Label>Özellikler (JSON dizi)</Label>
              <Input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder='["BiP ücretsiz", "TV+ dahil"]' />
              <p className="text-xs text-gray-400 mt-1">Virgülle ayrılmış JSON dizi formatında girin</p>
            </div>
            <div>
              <Label>Sıralama</Label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
                <Label>Aktif</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.popular} onCheckedChange={v => setForm({ ...form, popular: v })} />
                <Label>Popüler</Label>
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
            <AlertDialogTitle>Paketi Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu paketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
