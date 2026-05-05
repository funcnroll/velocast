import Bottleneck from "bottleneck";
import { useRoute } from "../../contexts/RouteContext";
import { fetchWeatherData } from "../../helpers/fetchWeatherData";
import { scoreWeatherConditions } from "../../helpers/scoreWeatherConditions";
import { useEffect } from "react";
import type { WeatherData } from "../../types/WeatherData";
import type { LatLon } from "../../types/LatLon";
import { green, red, yellow } from "../../config/colors";

function ShowWeather() {
  const { etaArr, riderProfile, setData, setIsLoading, sidebarData } =
    useRoute();

  useEffect(() => {
    const limiter = new Bottleneck({
      minTime: 200,
      maxConcurrent: 5, // 25 requests/s
    });

    let cancelled = false;

    async function run() {
      setIsLoading(true);
      const fetchData = etaArr.map((waypoint) => {
        return limiter.schedule(() =>
          // OpenMeteo expects [lat, lon], so its flipped here from internal [lon, lat] storage
          fetchWeatherData(waypoint.coord[1], waypoint.coord[0], waypoint.eta),
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
    }

    run();
    return () => {
      cancelled = true;
      setIsLoading(false);
    };
  }, [etaArr, riderProfile, setData, setIsLoading]);

  if (!sidebarData)
    return (
      <p className="text-zinc-400 text-sm">
        Click a segment to see weather details.
      </p>
    );

  const verdictColor =
    sidebarData.verdict === "green"
      ? green
      : sidebarData.verdict === "yellow"
        ? yellow
        : red;

  return (
    // Temporary, will be refactored into a nicer component
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
          <li>Apparent Temperature: {sidebarData.breakdown.apparent_temp}°C</li>
          <li>
            Precipitation Probability:{" "}
            {sidebarData.breakdown.precipitation_probability}%
          </li>
          <li>Rain: {sidebarData.breakdown.rain}mm</li>
          <li>Weather Code: {sidebarData.breakdown.weather_code}</li>
          <li>Wind Speed: {sidebarData.breakdown.wind_speed_10m}km/h</li>
          <li>Wind Gusts: {sidebarData.breakdown.wind_gusts_10m}km/h</li>
        </ul>
      </div>{" "}
    </div>
  );
}

export default ShowWeather;
