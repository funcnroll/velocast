import { useRoute } from "../../contexts/RouteContext";
import { fetchWeatherData } from "../../helpers/fetchWeatherData";
import { useQueries } from "@tanstack/react-query";

function ShowWeather() {
  const { etaArr } = useRoute();

  const results = useQueries({
    queries: etaArr.map((waypoint) => ({
      queryKey: [
        "weatherData",
        waypoint.coord[0],
        waypoint.coord[1],
        waypoint.eta,
      ],
      queryFn: () => {
        return fetchWeatherData(
          waypoint.coord[0],
          waypoint.coord[1],
          waypoint.eta,
        );
      },
    })),
  });

  console.log(results.map((result) => result.data));
  return <div></div>;
}

export default ShowWeather;
