import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://iyikmhcnawtijtbykgwc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWttaGNuYXd0aWp0YnlrZ3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDI4ODQsImV4cCI6MjA4NzQ3ODg4NH0.bRgK35Qzu-HQ_Dk0s2vfGIr9fwy0JkaslXZ8NYvH5o8"
);

// Test: insertar y leer con los nuevos campos
async function testNewColumns() {
  console.log("=== Verificando columnas nuevas ===\n");

  // Test pedidos
  const { data: pedido, error: e1 } = await supabase
    .from("pedidos")
    .select("id, total, subtotal, igv, descuento_total")
    .limit(1)
    .single();

  if (e1) {
    console.log("❌ pedidos - columnas no existen aún:", e1.message);
    console.log("\n⚠️  Ejecuta el SQL de back-restaurante/13_igv_descuento.sql");
    console.log("   en Supabase Dashboard > SQL Editor antes de continuar.\n");
    process.exit(1);
  }
  console.log("✅ pedidos tiene columnas: subtotal, igv, descuento_total");
  console.log("   Ejemplo:", pedido);

  // Test pedido_detalle
  const { data: detalle, error: e2 } = await supabase
    .from("pedido_detalle")
    .select("id, precio_unitario, precio_original, descuento, subtotal_item, igv_item")
    .limit(1)
    .single();

  if (e2) {
    console.log("❌ pedido_detalle - columnas no existen:", e2.message);
    process.exit(1);
  }
  console.log("✅ pedido_detalle tiene columnas: precio_original, descuento, subtotal_item, igv_item");
  console.log("   Ejemplo:", detalle);

  console.log("\n🎉 Migración verificada correctamente.");
}

testNewColumns();
