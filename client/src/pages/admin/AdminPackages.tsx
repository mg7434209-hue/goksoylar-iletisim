import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
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
  const createMutation = trpc.packages.create.useMutation({ onSuccess: () => { utils.packages.listAll.invalidate(); toast.success("Paket eklendi"); setOpen(false); } });
  const updateMutation = trpc.packages.update.useMutation({ onSuccess: () => { utils.packages.listAll.invalidate(); toast.success("Paket güncellendi"); setOpen(false); } });
  const deleteMutation = trpc.packages.delete.useMutation({ onSuccess: () => { utils.packages.listAll.invalidate(); toast.success("Paket silindi"); setDeleteId(null); } });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
    if (!form.name || !form.internet || !form.minutes || !form.price) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Paket Yönetimi</h1>
          <p className="text-gray-500 mt-1">{packages?.length ?? 0} paket kayıtlı</p>
        </div>
        <Button onClick={openCreate} className="bg-[#004899] hover:bg-[#003570]">
          <Plus className="w-4 h-4 mr-2" /> Yeni Paket
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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">İnternet</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Dakika</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">SMS</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packages?.map((pkg) => (
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">{editId ? "Paket Düzenle" : "Yeni Paket Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Paket Adı *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Star+ 15 GB" />
            </div>
            <div>
              <Label>Kategori *</Label>
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
              <Label>İnternet *</Label>
              <Input value={form.internet} onChange={e => setForm({ ...form, internet: e.target.value })} placeholder="15 GB" />
            </div>
            <div>
              <Label>Dakika *</Label>
              <Input value={form.minutes} onChange={e => setForm({ ...form, minutes: e.target.value })} placeholder="1000 dk" />
            </div>
            <div>
              <Label>SMS *</Label>
              <Input value={form.sms} onChange={e => setForm({ ...form, sms: e.target.value })} placeholder="250 SMS" />
            </div>
            <div>
              <Label>Fiyat (TL/ay) *</Label>
              <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="col-span-2">
              <Label>Özellikler (JSON dizi)</Label>
              <Input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder='["BiP ücretsiz", "TV+ dahil"]' />
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
