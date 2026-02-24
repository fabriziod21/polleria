import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { subirImagen } from "@/lib/database";

const emptyProduct = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  image: "",
  visible: true,
  salsasIds: [],
  extrasIds: [],
  bebidasIds: [],
};

export default function ProductFormDialog({ open, onClose, product, onSave }) {
  const { categorias, salsas, extras, bebidas } = useMenu();
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: String(product.price),
        salsasIds: product.salsasIds || [],
        extrasIds: product.extrasIds || [],
        bebidasIds: product.bebidasIds || [],
      });
    } else {
      setForm(emptyProduct);
    }
  }, [product, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
    });
    onClose();
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleItem = (arrayKey, itemId) => {
    setForm((prev) => {
      const current = prev[arrayKey] || [];
      const updated = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      return { ...prev, [arrayKey]: updated };
    });
  };

  const toggleAll = (arrayKey, allIds) => {
    setForm((prev) => {
      const current = prev[arrayKey] || [];
      const updated = current.length === allIds.length ? [] : [...allIds];
      return { ...prev, [arrayKey]: updated };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await subirImagen(file);
      update("image", url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      alert("Error subiendo imagen: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Categoría</Label>
            <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-zinc-900 dark:text-white">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Precio (S/)</Label>
            <Input
              type="number"
              step="0.1"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              required
            />
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Imagen</Label>
            <div className="flex gap-3 items-start">
              {form.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 flex-shrink-0">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <Input
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white flex-1"
                  placeholder="URL o sube una imagen"
                />
                <label
                  className={`inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-zinc-700 px-3 h-9 cursor-pointer transition-colors ${
                    uploading ? "opacity-50 cursor-wait" : "text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Visibilidad */}
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <button
              type="button"
              onClick={() => update("visible", !form.visible)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                form.visible ? "bg-green-600" : "bg-gray-300 dark:bg-zinc-700"
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                form.visible ? "translate-x-4.5" : "translate-x-1"
              }`} />
            </button>
            <div className="flex items-center gap-2">
              {form.visible ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {form.visible ? "Visible en el menú" : "Oculto del menú"}
              </span>
            </div>
          </label>

          {/* Salsas */}
          {salsas.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form.salsasIds || []).length > 0}
                  onChange={() => toggleAll("salsasIds", salsas.map((s) => s.id))}
                  className="rounded border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-zinc-400 focus:ring-zinc-500"
                />
                Salsas
                <span className="text-xs text-gray-500">
                  ({(form.salsasIds || []).length}/{salsas.length})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-auto transition-transform ${
                  (form.salsasIds || []).length > 0 ? "rotate-180" : ""
                }`} />
              </label>
              {(form.salsasIds || []).length > 0 && (
                <div className="ml-6 space-y-1 border-l border-gray-200 dark:border-zinc-800 pl-3">
                  {salsas.map((salsa) => (
                    <label key={salsa.id} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer py-1 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={(form.salsasIds || []).includes(salsa.id)}
                        onChange={() => toggleItem("salsasIds", salsa.id)}
                        className="rounded border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-zinc-400 focus:ring-zinc-500"
                      />
                      {salsa.image && (
                        <img src={salsa.image} alt={salsa.name} className="w-6 h-6 rounded object-cover" />
                      )}
                      {salsa.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form.extrasIds || []).length > 0}
                  onChange={() => toggleAll("extrasIds", extras.map((e) => e.id))}
                  className="rounded border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-zinc-400 focus:ring-zinc-500"
                />
                Extras
                <span className="text-xs text-gray-500">
                  ({(form.extrasIds || []).length}/{extras.length})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-auto transition-transform ${
                  (form.extrasIds || []).length > 0 ? "rotate-180" : ""
                }`} />
              </label>
              {(form.extrasIds || []).length > 0 && (
                <div className="ml-6 space-y-1 border-l border-gray-200 dark:border-zinc-800 pl-3">
                  {extras.map((extra) => (
                    <label key={extra.id} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer py-1 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={(form.extrasIds || []).includes(extra.id)}
                        onChange={() => toggleItem("extrasIds", extra.id)}
                        className="rounded border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-zinc-400 focus:ring-zinc-500"
                      />
                      {extra.image && (
                        <img src={extra.image} alt={extra.name} className="w-6 h-6 rounded object-cover" />
                      )}
                      {extra.name}
                      {extra.price > 0 && (
                        <span className="text-xs text-gray-400 ml-auto">+S/{extra.price.toFixed(2)}</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bebidas */}
          {bebidas.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form.bebidasIds || []).length > 0}
                  onChange={() => toggleAll("bebidasIds", bebidas.map((b) => b.id))}
                  className="rounded border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-zinc-400 focus:ring-zinc-500"
                />
                Bebidas
                <span className="text-xs text-gray-500">
                  ({(form.bebidasIds || []).length}/{bebidas.length})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-auto transition-transform ${
                  (form.bebidasIds || []).length > 0 ? "rotate-180" : ""
                }`} />
              </label>
              {(form.bebidasIds || []).length > 0 && (
                <div className="ml-6 space-y-1 border-l border-gray-200 dark:border-zinc-800 pl-3">
                  {bebidas.map((bebida) => (
                    <label key={bebida.id} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer py-1 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={(form.bebidasIds || []).includes(bebida.id)}
                        onChange={() => toggleItem("bebidasIds", bebida.id)}
                        className="rounded border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-zinc-400 focus:ring-zinc-500"
                      />
                      {bebida.image && (
                        <img src={bebida.image} alt={bebida.name} className="w-6 h-6 rounded object-cover" />
                      )}
                      {bebida.name}
                      {bebida.price > 0 && (
                        <span className="text-xs text-gray-400 ml-auto">+S/{bebida.price.toFixed(2)}</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold disabled:opacity-50">
              {product ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
