function ShowWeatherScoreVerdict({
  score,
  verdict,
  verdictColor,
}: {
  score: number;
  verdict: string;
  verdictColor: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/60 p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
          Score
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: verdictColor }}
        >
          {score}
          <span className="text-base text-zinc-500 font-normal">/100</span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
          Verdict
        </p>
        <span
          className="text-sm font-semibold capitalize px-2 py-1 rounded"
          style={{
            color: verdictColor,
          }}
        >
          {verdict}
        </span>
      </div>
    </div>
  );
}

export default ShowWeatherScoreVerdict;
