import { createContext, useContext, useState, useCallback } from "react";

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("mary_admin_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("mary_admin_theme", next);
      return next;
    });
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
