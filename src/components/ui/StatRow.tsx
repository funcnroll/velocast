function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-600/50 last:border-0">
      <span className="text-xs text-zinc-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-zinc-100">{value} </span>
    </div>
  );
}

export default StatRow;
