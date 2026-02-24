import { createContext, useContext, useState, useEffect } from "react";
import { fetchCategorias, fetchProductos, fetchSalsas, fetchExtras, fetchBebidas } from "@/lib/database";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [salsas, setSalsas] = useState([]);
  const [extras, setExtras] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        const [cats, prods, sals, exts, bebs] = await Promise.all([
          fetchCategorias(),
          fetchProductos(),
          fetchSalsas(),
          fetchExtras(),
          fetchBebidas(),
        ]);

        // Mapear nombres de columnas de BD a los que usa el frontend
        setCategorias(cats.map((c) => ({
          id: c.id,
          name: c.nombre,
          description: c.descripcion,
          image: c.imagen,
          sortOrder: c.orden,
        })));

        setProductos(prods.map((p) => ({
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

        setSalsas(sals.map((s) => ({
          id: s.id,
          name: s.nombre,
          image: s.imagen,
        })));

        setExtras(exts.map((e) => ({
          id: e.id,
          name: e.nombre,
          price: Number(e.precio),
          image: e.imagen,
        })));

        setBebidas(bebs.map((b) => ({
          id: b.id,
          name: b.nombre,
          price: Number(b.precio),
        })));

        setError(null);
      } catch (err) {
        console.error("Error cargando datos del menú:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const recargar = async () => {
    setCargando(true);
    try {
      const prods = await fetchProductos();
      setProductos(prods.map((p) => ({
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
    } catch (err) {
      console.error("Error recargando productos:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        categorias,
        productos,
        salsas,
        extras,
        bebidas,
        cargando,
        error,
        recargar,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
