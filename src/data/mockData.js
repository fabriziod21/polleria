import { products, categories } from "./menu";

const ORDERS_KEY = "mary_admin_orders";
const FINANCES_KEY = "mary_admin_finances";
const PRODUCTS_KEY = "mary_admin_products";

const statusOptions = ["pendiente", "preparando", "listo", "entregado"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOrders() {
  const orders = [];
  const now = new Date();

  for (let i = 0; i < 35; i++) {
    const daysAgo = randomInt(0, 6);
    const hour = randomInt(10, 21);
    const minute = randomInt(0, 59);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hour, minute, 0, 0);

    const numItems = randomInt(1, 4);
    const items = [];
    const usedIds = new Set();

    for (let j = 0; j < numItems; j++) {
      let product;
      do {
        product = randomPick(products);
      } while (usedIds.has(product.id));
      usedIds.add(product.id);

      const qty = randomInt(1, 3);
      items.push({
        productId: product.id,
        name: product.name,
        quantity: qty,
        unitPrice: product.price,
      });
    }

    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    // Older orders more likely delivered
    let estado;
    if (daysAgo >= 2) {
      estado = "entregado";
    } else if (daysAgo === 1) {
      estado = randomPick(["listo", "entregado", "entregado"]);
    } else {
      estado = randomPick(statusOptions);
    }

    orders.push({
      id: `ORD-${String(i + 1).padStart(3, "0")}`,
      fecha: date.toISOString(),
      items,
      total: Math.round(total * 100) / 100,
      estado,
    });
  }

  return orders.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

function generateFinances(orders) {
  const finances = [];
  const now = new Date();
  let id = 1;

  // Generate daily sales entries from orders (entradas)
  const dailySales = {};
  orders.forEach((order) => {
    const day = order.fecha.split("T")[0];
    dailySales[day] = (dailySales[day] || 0) + order.total;
  });

  Object.entries(dailySales).forEach(([day, total]) => {
    finances.push({
      id: `FIN-${String(id++).padStart(3, "0")}`,
      fecha: day,
      tipo: "entrada",
      categoria: "ventas",
      descripcion: `Ventas del día`,
      monto: Math.round(total * 100) / 100,
    });
  });

  // Generate expense entries (salidas)
  const gastos = [
    { categoria: "compras", descripcion: "Compra de insumos", min: 150, max: 400 },
    { categoria: "compras", descripcion: "Compra de pan y verduras", min: 50, max: 150 },
    { categoria: "servicios", descripcion: "Pago de luz", min: 80, max: 150 },
    { categoria: "servicios", descripcion: "Pago de agua", min: 30, max: 60 },
    { categoria: "servicios", descripcion: "Gas", min: 50, max: 100 },
    { categoria: "otros", descripcion: "Limpieza y mantenimiento", min: 30, max: 80 },
    { categoria: "compras", descripcion: "Compra de bebidas", min: 100, max: 250 },
    { categoria: "otros", descripcion: "Publicidad redes sociales", min: 20, max: 50 },
  ];

  for (let i = 0; i < 12; i++) {
    const daysAgo = randomInt(0, 29);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const gasto = randomPick(gastos);

    finances.push({
      id: `FIN-${String(id++).padStart(3, "0")}`,
      fecha: date.toISOString().split("T")[0],
      tipo: "salida",
      categoria: gasto.categoria,
      descripcion: gasto.descripcion,
      monto: randomInt(gasto.min, gasto.max),
    });
  }

  return finances.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export function initializeMockData() {
  // Products - seed from menu.js if not present
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  // Orders
  if (!localStorage.getItem(ORDERS_KEY)) {
    const orders = generateOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  // Finances
  if (!localStorage.getItem(FINANCES_KEY)) {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
    const finances = generateFinances(orders);
    localStorage.setItem(FINANCES_KEY, JSON.stringify(finances));
  }
}

export { ORDERS_KEY, FINANCES_KEY, PRODUCTS_KEY };
