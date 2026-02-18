import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
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
  const createMutation = trpc.accessories.create.useMutation({ onSuccess: () => { utils.accessories.listAll.invalidate(); toast.success("Aksesuar eklendi"); setOpen(false); } });
  const updateMutation = trpc.accessories.update.useMutation({ onSuccess: () => { utils.accessories.listAll.invalidate(); toast.success("Aksesuar güncellendi"); setOpen(false); } });
  const deleteMutation = trpc.accessories.delete.useMutation({ onSuccess: () => { utils.accessories.listAll.invalidate(); toast.success("Aksesuar silindi"); setDeleteId(null); } });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AccessoryForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
    if (!form.name || !form.category || !form.price || !form.image || !form.brand) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Aksesuar Yönetimi</h1>
          <p className="text-gray-500 mt-1">{accessories?.length ?? 0} aksesuar kayıtlı</p>
        </div>
        <Button onClick={openCreate} className="bg-[#004899] hover:bg-[#003570]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Aksesuar
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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Görsel</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aksesuar</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Marka</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {accessories?.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <img src={acc.image} alt={acc.name} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{acc.name}</td>
                    <td className="px-4 py-3 text-gray-600">{acc.brand}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{acc.category}</span>
                    </td>
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
                        <Button variant="ghost" size="sm" onClick={() => openEdit(acc)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(acc.id)}><Trash2 className="w-4 h-4" /></Button>
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
            <DialogTitle className="font-[Poppins]">{editId ? "Aksesuar Düzenle" : "Yeni Aksesuar Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Aksesuar Adı *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Apple AirPods Pro 2" />
            </div>
            <div>
              <Label>Marka *</Label>
              <Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Apple" />
            </div>
            <div>
              <Label>Kategori *</Label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Kulaklık, Kılıf, Şarj..." />
            </div>
            <div>
              <Label>Fiyat (TL) *</Label>
              <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Otomatik oluşturulur" />
            </div>
            <div className="col-span-2">
              <Label>Görsel URL *</Label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
