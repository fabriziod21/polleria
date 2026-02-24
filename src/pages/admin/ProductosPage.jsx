import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import { useAdminData } from "@/context/AdminDataContext";
import { categories } from "@/data/menu";

export default function ProductosPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || id;

  const handleSave = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{products.length} productos</p>
        <Button
          onClick={() => {
            setEditingProduct(null);
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
                <TableHead className="text-gray-500">Categoría</TableHead>
                <TableHead className="text-gray-500 text-right">Precio</TableHead>
                <TableHead className="text-gray-500 w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-zinc-800">
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[250px]">{product.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-zinc-800 text-gray-300 border-zinc-700 text-[11px]">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-400">
                    S/{product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-600/10"
                        onClick={() => setDeleteConfirm(product)}
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
        {products.map((product) => (
          <Card key={product.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <div className="flex gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{getCategoryName(product.categoryId)}</p>
                  <p className="text-sm font-bold text-red-400 mt-1">S/{product.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                    onClick={() => setDeleteConfirm(product)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400">
            ¿Estás seguro de eliminar <strong className="text-white">{deleteConfirm?.name}</strong>? Esta acción no se puede deshacer.
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
