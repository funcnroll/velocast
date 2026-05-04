import Bottleneck from "bottleneck";
import { useRoute } from "../../contexts/RouteContext";
import { fetchWeatherData } from "../../helpers/fetchWeatherData";
import { scoreWeatherConditions } from "../../helpers/scoreWeatherConditions";
import { useEffect } from "react";
import type { WeatherData } from "../../types/WeatherData";
import type { LatLon } from "../../types/LatLon";

function ShowWeather() {
  const { etaArr, riderProfile, data, setData, setIsLoading } = useRoute();

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
          fetchWeatherData(waypoint.coord[0], waypoint.coord[1], waypoint.eta),
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

  return <div></div>;
}

export default ShowWeather;
