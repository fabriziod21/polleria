import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pendiente: { label: "Pendiente", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  preparando: { label: "Preparando", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  listo: { label: "Listo", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  entregado: { label: "Entregado", className: "bg-gray-200/50 dark:bg-zinc-700/50 text-gray-500 dark:text-gray-400 border-gray-300/30 dark:border-zinc-600/30" },
};

export default function OrderStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pendiente;
  return (
    <Badge className={`${config.className} text-[11px] font-medium border`}>
      {config.label}
    </Badge>
  );
}
