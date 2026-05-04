import { useEffect } from "react";
import { useRoute } from "../../contexts/RouteContext";

function MapWeatherWaypoints() {
  const { weatherFetchPoints } = useRoute();

  useEffect(() => {
    console.log(weatherFetchPoints);
  }, [weatherFetchPoints]);

  return <div></div>;
}

export default MapWeatherWaypoints;
