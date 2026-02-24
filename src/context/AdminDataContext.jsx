import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useMenu } from "@/context/MenuContext";
import {
  fetchProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  fetchPedidos,
  actualizarEstadoPedido,
  fetchFinanzas,
  crearFinanza,
  eliminarFinanza,
} from "@/lib/database";

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const { categorias } = useMenu();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        const [prods, ords, fins] = await Promise.all([
          fetchProductosAdmin(),
          fetchPedidos().catch(() => []),
          fetchFinanzas().catch(() => []),
        ]);

        // Mapear productos de BD a formato frontend
        setProducts(prods.map((p) => ({
          id: p.id,
          categoryId: p.categoria_id,
          name: p.nombre,
          description: p.descripcion,
          price: Number(p.precio),
          image: p.imagen,
          hasSalsas: p.tiene_salsas,
          hasExtras: p.tiene_extras,
          hasBebidas: p.tiene_bebidas,
          active: p.activo,
        })));

        // Mapear pedidos
        setOrders(ords.map((o) => ({
          id: o.id,
          fecha: o.fecha_registro,
          tipoPedido: o.tipo_pedido,
          direccion: o.direccion,
          comentarios: o.comentarios,
          total: Number(o.total),
          estado: o.estado,
          items: (o.pedido_detalle || []).map((d) => ({
            id: d.id,
            productId: d.producto_id,
            name: d.nombre_producto,
            quantity: d.cantidad,
            unitPrice: Number(d.precio_unitario),
          })),
        })));

        // Mapear finanzas
        setFinances(fins.map((f) => ({
          id: f.id,
          fecha: f.fecha,
          tipo: f.tipo,
          categoria: f.categoria,
          descripcion: f.descripcion,
          monto: Number(f.monto),
        })));
      } catch (err) {
        console.error("Error cargando datos admin:", err);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // Products CRUD
  const addProduct = useCallback(async (product) => {
    const dbProduct = {
      categoria_id: product.categoryId,
      nombre: product.name,
      descripcion: product.description,
      precio: parseFloat(product.price) || 0,
      imagen: product.image,
      tiene_salsas: product.hasSalsas || false,
      tiene_extras: product.hasExtras || false,
      tiene_bebidas: product.hasBebidas || false,
    };
    const created = await crearProducto(dbProduct);
    setProducts((prev) => [...prev, {
      id: created.id,
      categoryId: created.categoria_id,
      name: created.nombre,
      description: created.descripcion,
      price: Number(created.precio),
      image: created.imagen,
      hasSalsas: created.tiene_salsas,
      hasExtras: created.tiene_extras,
      hasBebidas: created.tiene_bebidas,
      active: created.activo,
    }]);
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    const dbData = {};
    if (data.categoryId !== undefined) dbData.categoria_id = data.categoryId;
    if (data.name !== undefined) dbData.nombre = data.name;
    if (data.description !== undefined) dbData.descripcion = data.description;
    if (data.price !== undefined) dbData.precio = parseFloat(data.price) || 0;
    if (data.image !== undefined) dbData.imagen = data.image;
    if (data.hasSalsas !== undefined) dbData.tiene_salsas = data.hasSalsas;
    if (data.hasExtras !== undefined) dbData.tiene_extras = data.hasExtras;
    if (data.hasBebidas !== undefined) dbData.tiene_bebidas = data.hasBebidas;

    const updated = await actualizarProducto(id, dbData);
    setProducts((prev) =>
      prev.map((p) => p.id === id ? {
        id: updated.id,
        categoryId: updated.categoria_id,
        name: updated.nombre,
        description: updated.descripcion,
        price: Number(updated.precio),
        image: updated.imagen,
        hasSalsas: updated.tiene_salsas,
        hasExtras: updated.tiene_extras,
        hasBebidas: updated.tiene_bebidas,
        active: updated.activo,
      } : p)
    );
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await eliminarProducto(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Orders
  const updateOrderStatus = useCallback(async (id, estado) => {
    await actualizarEstadoPedido(id, estado);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado } : o))
    );
  }, []);

  const refreshOrders = useCallback(async () => {
    const ords = await fetchPedidos();
    setOrders(ords.map((o) => ({
      id: o.id,
      fecha: o.fecha_registro,
      tipoPedido: o.tipo_pedido,
      direccion: o.direccion,
      comentarios: o.comentarios,
      total: Number(o.total),
      estado: o.estado,
      items: (o.pedido_detalle || []).map((d) => ({
        id: d.id,
        productId: d.producto_id,
        name: d.nombre_producto,
        quantity: d.cantidad,
        unitPrice: Number(d.precio_unitario),
      })),
    })));
  }, []);

  // Finances
  const addFinanceEntry = useCallback(async (entry) => {
    const dbEntry = {
      id: `FIN-${Date.now()}`,
      fecha: entry.fecha,
      tipo: entry.tipo,
      categoria: entry.categoria,
      descripcion: entry.descripcion,
      monto: parseFloat(entry.monto) || 0,
    };
    const created = await crearFinanza(dbEntry);
    setFinances((prev) => [{
      id: created.id,
      fecha: created.fecha,
      tipo: created.tipo,
      categoria: created.categoria,
      descripcion: created.descripcion,
      monto: Number(created.monto),
    }, ...prev]);
  }, []);

  const deleteFinanceEntry = useCallback(async (id) => {
    await eliminarFinanza(id);
    setFinances((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Computed values
  const today = new Date().toISOString().split("T")[0];

  const todayOrders = useMemo(
    () => orders.filter((o) => o.fecha && o.fecha.startsWith(today)),
    [orders, today]
  );

  const todaySales = useMemo(
    () => todayOrders.reduce((sum, o) => sum + o.total, 0),
    [todayOrders]
  );

  const averageTicket = useMemo(
    () => (todayOrders.length > 0 ? todaySales / todayOrders.length : 0),
    [todaySales, todayOrders]
  );

  const productsSoldToday = useMemo(
    () =>
      todayOrders.reduce(
        (sum, o) => sum + (o.items || []).reduce((s, i) => s + i.quantity, 0),
        0
      ),
    [todayOrders]
  );

  const salesLast7Days = useMemo(() => {
    const days = [];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const total = orders
        .filter((o) => o.fecha && o.fecha.startsWith(key))
        .reduce((sum, o) => sum + o.total, 0);
      days.push({
        day: dayNames[d.getDay()],
        date: key,
        total: Math.round(total * 100) / 100,
      });
    }
    return days;
  }, [orders]);

  const ordersByCategory = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const cat = categorias.find((c) => c.id === product.categoryId);
          const name = cat ? cat.name : "Otros";
          counts[name] = (counts[name] || 0) + item.quantity;
        }
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [orders, products, categorias]);

  const financeSummary = useMemo(() => {
    const totalEntradas = finances
      .filter((f) => f.tipo === "entrada")
      .reduce((sum, f) => sum + f.monto, 0);
    const totalSalidas = finances
      .filter((f) => f.tipo === "salida")
      .reduce((sum, f) => sum + f.monto, 0);
    return {
      totalEntradas: Math.round(totalEntradas * 100) / 100,
      totalSalidas: Math.round(totalSalidas * 100) / 100,
      balance: Math.round((totalEntradas - totalSalidas) * 100) / 100,
    };
  }, [finances]);

  return (
    <AdminDataContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        orders, updateOrderStatus, refreshOrders,
        finances, addFinanceEntry, deleteFinanceEntry,
        todayOrders, todaySales, averageTicket, productsSoldToday,
        salesLast7Days, ordersByCategory, financeSummary,
        loading,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
