function ShowWeatherETA({ eta }: { eta: Date }) {
  return (
    <div className="flex items-center justify-between px-1">
      <span className="text-xs text-zinc-500 uppercase tracking-wide">ETA</span>
      <span className="text-sm font-medium text-zinc-300">
        {new Intl.DateTimeFormat(navigator.language, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(eta)}
      </span>
    </div>
  );
}

export default ShowWeatherETA;
