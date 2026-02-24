import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sandwich, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardContent className="pt-8 pb-8 px-6">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/20 mb-4">
                <Sandwich className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Sanguchería Mary</h1>
              <p className="text-sm text-gray-500 mt-1">Panel de Administración</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sangucheriamary.com"
                  className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Contraseña
                </label>
                <motion.div
                  animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa la contraseña"
                      className={`bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 pr-10 ${
                        error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-red-500/50"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs"
                  >
                    Email o contraseña incorrectos
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 disabled:opacity-50"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
