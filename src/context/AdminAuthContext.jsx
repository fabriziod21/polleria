import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const AdminAuthContext = createContext();
const ADMIN_PASSWORD = "mary2026";

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage("mary_admin_auth", false);

  const login = useCallback(
    (password) => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [setIsAuthenticated]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
