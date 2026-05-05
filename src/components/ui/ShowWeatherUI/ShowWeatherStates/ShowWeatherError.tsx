function ShowWeatherError({ error }: { error: string }) {
  return (
    <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800/50">
      <p className="text-sm text-red-400">{error}</p>
    </div>
  );
}

export default ShowWeatherError;
