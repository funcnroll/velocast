import { useEffect } from "react";
import Bottleneck from "bottleneck";
import { fetchWeatherData } from "../helpers/fetchWeatherData";
import { scoreWeatherConditions } from "../helpers/scoreWeatherConditions";
import type { WeatherData } from "../types/WeatherData";
import type { LatLon } from "../types/LatLon";
import { useRoute } from "./useRoute";

export function useWeatherFetch() {
  const {
    etaArr,
    riderProfile,
    setData,
    setIsLoading,
    setError,
    setHasLoaded,
  } = useRoute();

  useEffect(() => {
    // Prevent unnecessary fetch on mount
    if (!etaArr.length) return;

    const limiter = new Bottleneck({
      minTime: 200,
      maxConcurrent: 5, // 25 requests/s
    });
    let cancelled = false;

    async function run() {
      setError("");
      setIsLoading(true);
      setHasLoaded(false);

      const maxForecastTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const lastEta = etaArr.at(-1)?.eta;

      // Prevent eta going beyond 7 days from now (Open-Meteo only has reliable data 7 days from present)
      if (lastEta && lastEta > maxForecastTime) {
        setError(
          "Route ETA exceeds 7-day forecast limit. Try an earlier departure time or higher speed.",
        );
        setIsLoading(false);
        return;
      }

      try {
        const results: WeatherData[] = await Promise.all(
          etaArr.map((waypoint) =>
            limiter.schedule(() =>
              // Open-Meteo expects [lat, lon] (flipped from internal [lon, lat] for turf)
              fetchWeatherData(
                waypoint.coord[1],
                waypoint.coord[0],
                waypoint.eta,
              ),
            ),
          ),
        );

        if (!cancelled) {
          setData(
            results.map((result, i) => ({
              ...scoreWeatherConditions(result, riderProfile),
              coord: etaArr[i].coord as LatLon,
              eta: etaArr[i].eta,
            })),
          );
          setIsLoading(false);
          setHasLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to fetch weather data. Please try again.");
          setIsLoading(false);
          setHasLoaded(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
      setIsLoading(false);
    };
    // NOTE: riderProfile triggers unnecessary refetch, but keeping it simple with one effect outweighs optimizing with extra state + effect
    // It is not expected that riderProfile changes often, so optimization is unnecessary when considering the potential added complexity otherwise
  }, [etaArr, riderProfile, setData, setIsLoading, setError, setHasLoaded]);
}
