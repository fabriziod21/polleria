import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://iyikmhcnawtijtbykgwc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWttaGNuYXd0aWp0YnlrZ3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDI4ODQsImV4cCI6MjA4NzQ3ODg4NH0.bRgK35Qzu-HQ_Dk0s2vfGIr9fwy0JkaslXZ8NYvH5o8"
);

const tables = ["categorias", "productos", "salsas", "extras", "bebidas", "pedidos", "pedido_detalle", "usuarios"];

console.log("=== Estado de la BD - Sanguchería Mary ===\n");

for (const table of tables) {
  const { data, error, count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: false })
    .limit(5);

  if (error) {
    console.log(`❌ ${table}: ${error.message}`);
  } else {
    console.log(`✅ ${table}: ${data.length} registros (mostrando max 5)`);
    if (data.length > 0) {
      const cols = Object.keys(data[0]);
      console.log(`   Columnas: ${cols.join(", ")}`);
      data.forEach((row, i) => {
        const preview = cols.slice(0, 4).map(c => `${c}=${JSON.stringify(row[c])}`).join(", ");
        console.log(`   [${i+1}] ${preview}`);
      });
    }
    console.log();
  }
}
