import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sandwich } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides, restaurantInfo } from "@/data/menu";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.1,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function HeroCarousel() {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const paginate = useCallback(
    (newDirection) => {
      setCurrent(([prev]) => {
        const next = (prev + newDirection + heroSlides.length) % heroSlides.length;
        return [next, newDirection];
      });
    },
    []
  );

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, paginate]);

  const goToSlide = (index) => {
    const dir = index > current ? 1 : -1;
    setCurrent([index, dir]);
  };

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={() => setIsAutoPlaying(false)}
      onTouchEnd={() => {
        setTimeout(() => setIsAutoPlaying(true), 3000);
      }}
    >
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-2xl space-y-4 md:space-y-6"
            >
              {/* Badge */}
              <motion.div variants={textVariants} custom={0}>
                <span className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
                  <Sandwich className="w-4 h-4" />
                  {restaurantInfo.name}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={textVariants}
                custom={1}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight"
              >
                {slide.title.split(" ").map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                      {word}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={textVariants}
                custom={2}
                className="text-base sm:text-lg md:text-xl text-gray-300/90 max-w-lg leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA */}
              <motion.div
                variants={textVariants}
                custom={3}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link to="/menu">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all"
                  >
                    {slide.cta}
                  </Button>
                </Link>
                <a href={`tel:${restaurantInfo.phone}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base backdrop-blur-sm"
                  >
                    Llamar Ahora
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between pointer-events-none px-2 sm:px-4">
        <button
          onClick={() => paginate(-1)}
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-red-600/80 backdrop-blur-sm border border-white/10 hover:border-red-500/50 flex items-center justify-center text-white transition-all group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-red-600/80 backdrop-blur-sm border border-white/10 hover:border-red-500/50 flex items-center justify-center text-white transition-all group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Dots / Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
          >
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                index === current
                  ? "w-8 sm:w-10 bg-red-500"
                  : "w-2 sm:w-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
            {/* Progress bar on active dot */}
            {index === current && isAutoPlaying && (
              <motion.div
                className="absolute inset-0 h-2 rounded-full bg-red-300/50 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                key={`progress-${current}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-20 text-white/40 text-xs sm:text-sm font-mono">
        <span className="text-white font-bold">{String(current + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(heroSlides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
