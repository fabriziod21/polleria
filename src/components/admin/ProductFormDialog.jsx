import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { subirImagen } from "@/lib/database";

const emptyProduct = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  image: "",
  hasSalsas: false,
  hasExtras: false,
  hasBebidas: false,
};

export default function ProductFormDialog({ open, onClose, product, onSave }) {
  const { categorias } = useMenu();
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({ ...product, price: String(product.price) });
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await subirImagen(file);
      update("image", url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-400">Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Categoría</Label>
            <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-white">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Precio (S/)</Label>
            <Input
              type="number"
              step="0.1"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <Label className="text-gray-400">Imagen</Label>
            <div className="flex gap-2">
              <Input
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white flex-1"
                placeholder="URL o sube una imagen"
              />
              <Button
                type="button"
                variant="outline"
                className="border-zinc-700 text-gray-400 hover:text-white px-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {form.image && (
              <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-zinc-800">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { key: "hasSalsas", label: "Salsas" },
              { key: "hasExtras", label: "Extras" },
              { key: "hasBebidas", label: "Bebidas" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-500"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
              {product ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
