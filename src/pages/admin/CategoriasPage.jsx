import { useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CategoryFormDialog from "@/components/admin/CategoryFormDialog";
import { useAdminData } from "@/context/AdminDataContext";
import { useMenu } from "@/context/MenuContext";

export default function CategoriasPage() {
  const { addCategory, updateCategory, deleteCategory } = useAdminData();
  const { categorias } = useMenu();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const sorted = [...categorias].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleSave = (data) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteCategory(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categorias.length} categorías</p>
        <Button
          onClick={() => { setEditingCategory(null); setFormOpen(true); }}
          className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 rounded-xl font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      {/* Categories List */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <FolderOpen className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">No hay categorías registradas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-3 hover:border-gray-300 dark:hover:border-zinc-700/60 transition-colors"
            >
              {/* Image */}
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-gray-300 dark:text-zinc-700" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{cat.name}</p>
                  <Badge className="bg-gray-100 dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700 text-[10px] flex-shrink-0">
                    #{cat.sortOrder ?? 0}
                  </Badge>
                </div>
                {cat.description && (
                  <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                )}
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{cat.id}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg" onClick={() => handleEdit(cat)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-600/10 rounded-lg" onClick={() => setDeleteConfirm(cat)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingCategory(null); }}
        category={editingCategory}
        onSave={handleSave}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar categoría</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Estás seguro de eliminar <strong className="text-zinc-900 dark:text-white">{deleteConfirm?.name}</strong>? Los productos quedarán sin categoría.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 text-gray-500 dark:text-gray-400">
              Cancelar
            </Button>
            <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
