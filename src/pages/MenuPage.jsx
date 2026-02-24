import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Flame, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories, products } from "@/data/menu";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addItem } = useCart();

  // Open product from URL param
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId) {
      const product = products.find((p) => p.id === parseInt(productId));
      if (product) {
        setSelectedProduct(product);
        setModalOpen(true);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === "all" || p.categoryId === activeCategory;
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-12 md:py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 to-zinc-950" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <Badge className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 text-xs mb-3">
              <Flame className="w-3 h-3 mr-1" />
              NUESTRO MENÚ
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              {activeCategory === "all"
                ? "Todo el Menú"
                : categories.find((c) => c.id === activeCategory)?.name || "Menú"}
            </h1>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar platos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500/50 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="sticky top-16 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-gray-400 text-lg">No se encontraron platos</p>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ver todo el menú
              </Button>
            </div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  custom={i}
                  layout
                >
                  <Card
                    className="group relative overflow-hidden bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer h-full"
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Quick Add Button */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(product, 1, [], [], []);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <Badge className="bg-red-600 text-white text-[11px] mb-1.5 border-0">
                        S/{product.price.toFixed(2)}
                      </Badge>
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-[11px] md:text-xs mt-1 line-clamp-2 hidden md:block">
                        {product.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
