import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Facebook, Instagram, ChevronRight, Sandwich, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { restaurantInfo, categories, products } from "@/data/menu";
import HeroCarousel from "@/components/HeroCarousel";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const featuredProducts = products.filter(p =>
    ["hamburguesas", "sanguchos", "hotdogs"].includes(p.categoryId)
  ).slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO CAROUSEL ===== */}
      <HeroCarousel />

      {/* ===== INFO BAR ===== */}
      <section className="bg-red-600 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-white text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{restaurantInfo.address}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{restaurantInfo.hours}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-3">
            <a href={restaurantInfo.social.facebook} className="hover:text-red-200 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={restaurantInfo.social.instagram} className="hover:text-red-200 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={`tel:${restaurantInfo.phone}`} className="hover:text-red-200 transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 text-xs mb-4">
                <Sandwich className="w-3 h-3 mr-1" />
                NUESTRO MENÚ
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-white">
              Categorías
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 mt-3 max-w-lg mx-auto">
              Explora nuestra variedad de sanguchos, hamburguesas y más
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {categories.map((cat, i) => (
              <motion.div key={cat.id} variants={fadeUp} custom={i}>
                <Link to={`/menu?category=${cat.id}`}>
                  <Card className="group relative overflow-hidden bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight uppercase">
                        {cat.name}
                      </h3>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/menu">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
              >
                Ver Todo el Menú
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-zinc-950 via-red-950/10 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 text-xs mb-4">
                <Star className="w-3 h-3 mr-1" />
                MÁS POPULARES
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-white">
              Los Favoritos
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} variants={fadeUp} custom={i}>
                <Link to={`/menu?product=${product.id}`}>
                  <Card className="group relative overflow-hidden bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <Badge className="bg-red-600 text-white text-[11px] mb-2 border-0">
                        S/{product.price.toFixed(2)}
                      </Badge>
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-[11px] md:text-xs mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1920&q=80"
            alt="Hamburguesa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white"
          >
            ¿Listo para ordenar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-red-100/80 text-lg"
          >
            Haz tu pedido ahora y disfruta de los mejores sanguchos y hamburguesas
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-3"
          >
            <Link to="/menu">
              <Button
                size="lg"
                className="bg-white text-red-700 hover:bg-gray-100 font-bold px-8 py-6 text-base"
              >
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Ordenar Ahora
              </Button>
            </Link>
            <a href={`tel:${restaurantInfo.phone}`}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-6 text-base"
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
