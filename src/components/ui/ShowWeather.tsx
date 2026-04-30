import Bottleneck from "bottleneck";
import { useRoute } from "../../contexts/RouteContext";
import { fetchWeatherData } from "../../helpers/fetchWeatherData";
import { scoreWeatherConditions } from "../../helpers/scoreWeatherConditions";
import { useEffect } from "react";

function ShowWeather() {
  const { etaArr, riderProfile, data, setData } = useRoute();

  useEffect(() => {
    const limiter = new Bottleneck({
      minTime: 200,
      maxConcurrent: 5, // 25 requests/s
    });

    let cancelled = false;

    async function run() {
      const fetchData = etaArr.map((waypoint) => {
        return limiter.schedule(() =>
          fetchWeatherData(waypoint.coord[0], waypoint.coord[1], waypoint.eta),
        );
      });

      const results = await Promise.all(fetchData);

      if (!cancelled && results) {
        const scoredData = results.map((result) =>
          scoreWeatherConditions(result, riderProfile),
        );
        setData(scoredData);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [etaArr, riderProfile, setData]);

  console.log(data);

  return <div></div>;
}

export default ShowWeather;
