import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <p className="text-sm text-gray-400">{categorias.length} categorías</p>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setFormOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      {/* Desktop Table */}
      <Card className="bg-zinc-900 border-zinc-800 hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-gray-500 w-12"></TableHead>
                <TableHead className="text-gray-500">Nombre</TableHead>
                <TableHead className="text-gray-500">Descripción</TableHead>
                <TableHead className="text-gray-500 w-20 text-center">Orden</TableHead>
                <TableHead className="text-gray-500 w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((cat) => (
                <TableRow key={cat.id} className="border-zinc-800">
                  <TableCell>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-500 text-xs">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-white">{cat.name}</p>
                      <p className="text-xs text-gray-600">{cat.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-400 truncate max-w-[300px]">{cat.description}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-400">{cat.sortOrder ?? 0}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800"
                        onClick={() => handleEdit(cat)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-600/10"
                        onClick={() => setDeleteConfirm(cat)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((cat) => (
          <Card key={cat.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <div className="flex gap-3">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-500 flex-shrink-0">
                    —
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{cat.name}</p>
                  <p className="text-xs text-gray-600">{cat.id}</p>
                  <p className="text-xs text-gray-500 mt-1">Orden: {cat.sortOrder ?? 0}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => handleEdit(cat)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                    onClick={() => setDeleteConfirm(cat)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar categoría</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400">
            ¿Estás seguro de eliminar <strong className="text-white">{deleteConfirm?.name}</strong>? Los productos de esta categoría quedarán sin categoría.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 text-gray-400">
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
