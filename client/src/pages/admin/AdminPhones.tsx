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

type PhoneForm = {
  slug: string; name: string; brand: string; price: number; oldPrice: number | null;
  image: string; storage: string; ram: string; screen: string; camera: string;
  battery: string; color: string; badge: string | null; installment: string | null;
  isActive: boolean; sortOrder: number;
};

const emptyForm: PhoneForm = {
  slug: "", name: "", brand: "", price: 0, oldPrice: null,
  image: "", storage: "", ram: "", screen: "", camera: "",
  battery: "", color: "", badge: null, installment: null,
  isActive: true, sortOrder: 0,
};

export default function AdminPhones() {
  const utils = trpc.useUtils();
  const { data: phones, isLoading } = trpc.phones.listAll.useQuery();
  const createMutation = trpc.phones.create.useMutation({ onSuccess: () => { utils.phones.listAll.invalidate(); toast.success("Telefon eklendi"); setOpen(false); } });
  const updateMutation = trpc.phones.update.useMutation({ onSuccess: () => { utils.phones.listAll.invalidate(); toast.success("Telefon güncellendi"); setOpen(false); } });
  const deleteMutation = trpc.phones.delete.useMutation({ onSuccess: () => { utils.phones.listAll.invalidate(); toast.success("Telefon silindi"); setDeleteId(null); } });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PhoneForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (phone: any) => {
    setEditId(phone.id);
    setForm({
      slug: phone.slug, name: phone.name, brand: phone.brand, price: phone.price,
      oldPrice: phone.oldPrice, image: phone.image, storage: phone.storage, ram: phone.ram,
      screen: phone.screen, camera: phone.camera, battery: phone.battery, color: phone.color,
      badge: phone.badge, installment: phone.installment, isActive: phone.isActive, sortOrder: phone.sortOrder,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.brand || !form.price || !form.image) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const data = { ...form, slug, oldPrice: form.oldPrice || undefined, badge: form.badge || undefined, installment: form.installment || undefined };
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
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Telefon Yönetimi</h1>
          <p className="text-gray-500 mt-1">{phones?.length ?? 0} telefon kayıtlı</p>
        </div>
        <Button onClick={openCreate} className="bg-[#004899] hover:bg-[#003570]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Telefon
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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Telefon</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Marka</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {phones?.map((phone) => (
                  <tr key={phone.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <img src={phone.image} alt={phone.name} className="w-12 h-14 object-cover rounded-lg" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{phone.name}</p>
                      <p className="text-xs text-gray-400">{phone.storage} · {phone.color}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{phone.brand}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#004899]">{formatPrice(phone.price)}</p>
                      {phone.oldPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(phone.oldPrice)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {phone.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Aktif</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Pasif</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(phone)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(phone.id)}><Trash2 className="w-4 h-4" /></Button>
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">{editId ? "Telefon Düzenle" : "Yeni Telefon Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Telefon Adı *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="iPhone 16 Pro Max" />
            </div>
            <div>
              <Label>Marka *</Label>
              <Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Apple" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Otomatik oluşturulur" />
            </div>
            <div>
              <Label>Fiyat (TL) *</Label>
              <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Eski Fiyat (TL)</Label>
              <Input type="number" value={form.oldPrice || ""} onChange={e => setForm({ ...form, oldPrice: parseInt(e.target.value) || null })} />
            </div>
            <div className="col-span-2">
              <Label>Görsel URL *</Label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>Depolama *</Label>
              <Input value={form.storage} onChange={e => setForm({ ...form, storage: e.target.value })} placeholder="256 GB" />
            </div>
            <div>
              <Label>RAM *</Label>
              <Input value={form.ram} onChange={e => setForm({ ...form, ram: e.target.value })} placeholder="8 GB" />
            </div>
            <div>
              <Label>Ekran *</Label>
              <Input value={form.screen} onChange={e => setForm({ ...form, screen: e.target.value })} placeholder="6.9 inç OLED" />
            </div>
            <div>
              <Label>Kamera *</Label>
              <Input value={form.camera} onChange={e => setForm({ ...form, camera: e.target.value })} placeholder="48 MP + 12 MP" />
            </div>
            <div>
              <Label>Batarya *</Label>
              <Input value={form.battery} onChange={e => setForm({ ...form, battery: e.target.value })} placeholder="4685 mAh" />
            </div>
            <div>
              <Label>Renk *</Label>
              <Input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Titan Siyah" />
            </div>
            <div>
              <Label>Etiket</Label>
              <Input value={form.badge || ""} onChange={e => setForm({ ...form, badge: e.target.value || null })} placeholder="Yeni, Popüler, İndirimli" />
            </div>
            <div>
              <Label>Taksit</Label>
              <Input value={form.installment || ""} onChange={e => setForm({ ...form, installment: e.target.value || null })} placeholder="12 Taksit" />
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
            <AlertDialogTitle>Telefonu Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu telefonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
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
