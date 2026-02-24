import { createContext, useContext, useCallback, useMemo, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initializeMockData, ORDERS_KEY, FINANCES_KEY, PRODUCTS_KEY } from "@/data/mockData";
import { categories } from "@/data/menu";

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  // Initialize mock data on first mount
  useEffect(() => {
    initializeMockData();
  }, []);

  const [products, setProducts] = useLocalStorage(PRODUCTS_KEY, []);
  const [orders, setOrders] = useLocalStorage(ORDERS_KEY, []);
  const [finances, setFinances] = useLocalStorage(FINANCES_KEY, []);

  // Products CRUD
  const addProduct = useCallback(
    (product) => {
      const newProduct = { ...product, id: Date.now() };
      setProducts((prev) => [...prev, newProduct]);
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (id, data) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    [setProducts]
  );

  // Orders
  const updateOrderStatus = useCallback(
    (id, estado) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado } : o))
      );
    },
    [setOrders]
  );

  // Finances
  const addFinanceEntry = useCallback(
    (entry) => {
      const newEntry = { ...entry, id: `FIN-${Date.now()}` };
      setFinances((prev) => [newEntry, ...prev]);
    },
    [setFinances]
  );

  const deleteFinanceEntry = useCallback(
    (id) => {
      setFinances((prev) => prev.filter((f) => f.id !== id));
    },
    [setFinances]
  );

  // Computed values
  const today = new Date().toISOString().split("T")[0];

  const todayOrders = useMemo(
    () => orders.filter((o) => o.fecha.startsWith(today)),
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
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
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
        .filter((o) => o.fecha.startsWith(key))
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
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const cat = categories.find((c) => c.id === product.categoryId);
          const name = cat ? cat.name : "Otros";
          counts[name] = (counts[name] || 0) + item.quantity;
        }
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [orders, products]);

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
        orders, updateOrderStatus,
        finances, addFinanceEntry, deleteFinanceEntry,
        todayOrders, todaySales, averageTicket, productsSoldToday,
        salesLast7Days, ordersByCategory, financeSummary,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
