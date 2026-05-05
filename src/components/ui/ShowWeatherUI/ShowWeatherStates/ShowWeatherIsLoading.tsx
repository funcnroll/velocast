function ShowWeatherIsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-8 h-8 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
      <p className="text-xs text-zinc-500 uppercase tracking-wide ">
        Fetching weather
      </p>
    </div>
  );
}

export default ShowWeatherIsLoading;
