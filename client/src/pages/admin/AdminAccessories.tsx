import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Search, Headphones } from "lucide-react";
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

type AccessoryForm = {
  slug: string; name: string; category: string; price: number;
  image: string; brand: string; isActive: boolean; sortOrder: number;
};

const emptyForm: AccessoryForm = {
  slug: "", name: "", category: "", price: 0,
  image: "", brand: "", isActive: true, sortOrder: 0,
};

export default function AdminAccessories() {
  const utils = trpc.useUtils();
  const { data: accessories, isLoading } = trpc.accessories.listAll.useQuery();
  const createMutation = trpc.accessories.create.useMutation({
    onSuccess: () => { utils.accessories.listAll.invalidate(); toast.success("Aksesuar başarıyla eklendi"); setOpen(false); },
    onError: (err) => { toast.error("Hata: " + (err.message || "Aksesuar eklenemedi")); },
  });
  const updateMutation = trpc.accessories.update.useMutation({
    onSuccess: () => { utils.accessories.listAll.invalidate(); toast.success("Aksesuar başarıyla güncellendi"); setOpen(false); },
    onError: (err) => { toast.error("Hata: " + (err.message || "Aksesuar güncellenemedi")); },
  });
  const deleteMutation = trpc.accessories.delete.useMutation({
    onSuccess: () => { utils.accessories.listAll.invalidate(); toast.success("Aksesuar başarıyla silindi"); setDeleteId(null); },
    onError: (err) => { toast.error("Hata: " + (err.message || "Aksesuar silinemedi")); },
  });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AccessoryForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccessories = useMemo(() => {
    if (!accessories) return [];
    if (!searchQuery.trim()) return accessories;
    const q = searchQuery.toLowerCase();
    return accessories.filter((a: any) =>
      a.name.toLowerCase().includes(q) ||
      a.brand.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }, [accessories, searchQuery]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (acc: any) => {
    setEditId(acc.id);
    setForm({
      slug: acc.slug, name: acc.name, category: acc.category,
      price: acc.price, image: acc.image, brand: acc.brand,
      isActive: acc.isActive, sortOrder: acc.sortOrder,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Aksesuar adı zorunludur"); return; }
    if (!form.category.trim()) { toast.error("Kategori zorunludur"); return; }
    if (!form.brand.trim()) { toast.error("Marka zorunludur"); return; }
    if (!form.price || form.price <= 0) { toast.error("Geçerli bir fiyat girin"); return; }
    if (!form.image.trim()) { toast.error("Görsel URL zorunludur"); return; }

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const data = { ...form, slug };
    if (editId) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatPrice = (p: number) => new Intl.NumberFormat("tr-TR").format(p) + " TL";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Aksesuar Yönetimi</h1>
          <p className="text-gray-500 mt-1">{accessories?.length ?? 0} aksesuar kayıtlı</p>
        </div>
        <Button onClick={openCreate} className="bg-[#004899] hover:bg-[#003570]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Aksesuar
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Aksesuar adı, marka veya kategori ile arayın..."
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
      ) : filteredAccessories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            {searchQuery ? "Sonuç bulunamadı" : "Henüz aksesuar eklenmemiş"}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery ? `"${searchQuery}" aramasına uygun aksesuar bulunamadı.` : "İlk aksesuarı eklemek için yukarıdaki butonu kullanın."}
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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Görsel</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aksesuar</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Marka</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAccessories.map((acc: any) => (
                  <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <img src={acc.image} alt={acc.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='%23ccc'%3E%3Crect width='48' height='48' rx='8' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='12' fill='%239ca3af'%3E?%3C/text%3E%3C/svg%3E"; }} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{acc.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{acc.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{acc.brand}</td>
                    <td className="px-4 py-3 font-semibold text-[#004899]">{formatPrice(acc.price)}</td>
                    <td className="px-4 py-3">
                      {acc.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Aktif</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Pasif</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(acc)} title="Düzenle"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(acc.id)} title="Sil"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {searchQuery && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              {filteredAccessories.length} / {accessories?.length} aksesuar gösteriliyor
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">{editId ? "Aksesuar Düzenle" : "Yeni Aksesuar Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Aksesuar Adı <span className="text-red-500">*</span></Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Apple AirPods Pro 2" />
            </div>
            <div>
              <Label>Kategori <span className="text-red-500">*</span></Label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Kulaklık" />
            </div>
            <div>
              <Label>Marka <span className="text-red-500">*</span></Label>
              <Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Apple" />
            </div>
            <div>
              <Label>Fiyat (TL) <span className="text-red-500">*</span></Label>
              <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Otomatik oluşturulur" />
            </div>
            <div className="col-span-2">
              <Label>Görsel URL <span className="text-red-500">*</span></Label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              {form.image && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={form.image}
                    alt="Önizleme"
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-gray-50"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="text-xs text-gray-400">Görsel önizleme</span>
                </div>
              )}
            </div>
            <div>
              <Label>Sıralama</Label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
              <Label>Aktif</Label>
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
            <AlertDialogTitle>Aksesuarı Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu aksesuarı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
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
