export default function StatCard({ title, value, icon: Icon, description, trend }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-4 hover:border-gray-300 dark:hover:border-zinc-700/60 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}
