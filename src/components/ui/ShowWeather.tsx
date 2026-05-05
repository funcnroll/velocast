import Bottleneck from "bottleneck";
import { fetchWeatherData } from "../../helpers/fetchWeatherData";
import { scoreWeatherConditions } from "../../helpers/scoreWeatherConditions";
import { useEffect } from "react";
import type { WeatherData } from "../../types/WeatherData";
import type { LatLon } from "../../types/LatLon";
import { green, red, yellow } from "../../config/colors";
import { useRoute } from "../../hooks/useRoute";

function ShowWeather() {
  const {
    etaArr,
    riderProfile,
    setData,
    setIsLoading,
    sidebarData,
    error,
    gpxLines,
    setError,
  } = useRoute();

  useEffect(() => {
    const limiter = new Bottleneck({
      minTime: 200,
      maxConcurrent: 5, // 25 requests/s
    });

    let cancelled = false;

    async function run() {
      setError("");
      setIsLoading(true);
      try {
        const fetchData = etaArr.map((waypoint) => {
          return limiter.schedule(() =>
            fetchWeatherData(
              waypoint.coord[1],
              waypoint.coord[0],
              waypoint.eta,
            ),
          );
        });

        const results: WeatherData[] = await Promise.all(fetchData);

        if (!cancelled && results) {
          const scoredData = results.map((result, i) => ({
            ...scoreWeatherConditions(result, riderProfile),
            coord: etaArr[i].coord as LatLon,
          }));
          setData(scoredData);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to fetch weather data. Please try again.");
          setIsLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
      setIsLoading(false);
    };
  }, [etaArr, riderProfile, setData, setIsLoading, setError]);

  if (!gpxLines && !error) return null;

  if (!sidebarData && !error)
    return (
      <p className="text-zinc-400 text-sm">
        Click a segment to see weather details.
      </p>
    );

  if (error) return <div>{error}</div>;

  const verdictColor =
    sidebarData.verdict === "green"
      ? green
      : sidebarData.verdict === "yellow"
        ? yellow
        : red;

  return (
    // Temporary, will be refactored into a nicer component

    // TODO: UI polish:
    // - Wind direction as compass label (N/NE/SW etc) not raw degrees
    // - UV index with severity label (low/moderate/high/very high)
    // - Separate raw breakdown data from advisory messages
    // - If weather code triggered a red verdict, show it prominently as the reason
    //   before showing the rest of the breakdown
    <div className="mt-4 p-3 rounded-lg bg-zinc-700 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">Score</span>
        <span
          className="text-lg font-bold"
          style={{ color: verdictColor }}
        >
          {sidebarData.score}/100
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">Verdict</span>
        <span
          className="text-sm font-semibold capitalize"
          style={{ color: verdictColor }}
        >
          {sidebarData.verdict}
        </span>
      </div>
      <p className="text-sm text-zinc-400">{sidebarData.message}</p>
      <div>
        <p>Composed of:</p>
        <ul>
          <li>
            Apparent Temperature: {sidebarData.breakdown?.apparent_temp}°C
          </li>
          <li>
            Precipitation Probability:{" "}
            {sidebarData.breakdown?.precipitation_probability}%
          </li>
          <li>Rain: {sidebarData.breakdown?.rain}mm</li>
          <li>Weather Code: {sidebarData.breakdown?.weather_code}</li>
          <li>Wind Speed: {sidebarData.breakdown?.wind_speed_10m}km/h</li>
          <li>Wind Gusts: {sidebarData.breakdown?.wind_gusts_10m}km/h</li>
          <li>Wind Direction: {sidebarData.breakdown?.wind_direction_10m}°</li>
          <li>UV Index: {sidebarData.breakdown?.uv_index}</li>
        </ul>
      </div>{" "}
    </div>
  );
}

export default ShowWeather;
