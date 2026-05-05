// hooks/useWeatherFetch.ts
import { useEffect } from "react";
import Bottleneck from "bottleneck";
import { fetchWeatherData } from "../helpers/fetchWeatherData";
import { scoreWeatherConditions } from "../helpers/scoreWeatherConditions";
import type { WeatherData } from "../types/WeatherData";
import type { LatLon } from "../types/LatLon";
import { useRoute } from "./useRoute";

export function useWeatherFetch() {
  const { etaArr, riderProfile, setData, setIsLoading, setError } = useRoute();

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
}
