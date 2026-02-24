import { createContext, useContext, useState, useCallback } from "react";
import { loginAdmin } from "@/lib/database";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mary_admin_auth")) || false;
    } catch {
      return false;
    }
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mary_admin_user")) || null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, contrasena) => {
    const user = await loginAdmin(email, contrasena);
    if (user) {
      setIsAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem("mary_admin_auth", "true");
      localStorage.setItem("mary_admin_user", JSON.stringify(user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("mary_admin_auth");
    localStorage.removeItem("mary_admin_user");
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
