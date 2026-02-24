import { Sandwich, MapPin, Clock, Phone, Facebook, Instagram } from "lucide-react";
import { restaurantInfo } from "@/data/menu";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-red-900/20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sandwich className="w-6 h-6 text-red-500" />
              <span className="text-white font-bold text-lg">{restaurantInfo.name}</span>
            </div>
            <p className="text-sm leading-relaxed">
              {restaurantInfo.slogan}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Información</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                {restaurantInfo.address}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                {restaurantInfo.hours}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                Llámanos
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href={restaurantInfo.social.facebook}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={restaurantInfo.social.instagram}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={restaurantInfo.social.tiktok}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all text-sm font-bold"
              >
                T
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-xs text-gray-600">
          © 2026 {restaurantInfo.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
