import { useEffect } from "react";
import { useRoute } from "../../contexts/RouteContext";
import type { Waypoint } from "../../types/Waypoint";

function DistanceCalculator({
  departureTime,
  speed,
}: {
  departureTime: Date;
  speed: number;
}) {
  const { weatherFetchPoints, setEtaArr } = useRoute();

  useEffect(() => {
    if (!weatherFetchPoints.length || !speed) return;

    const etaArr: Waypoint[] = weatherFetchPoints.map((point, i) => {
      const coords = point.geometry.coordinates as [number, number];
      const distanceKm = i * 5;
      const hoursToArrive = distanceKm / speed;

      // calculate eta by adding hoursToArrive to departureTime
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;

      return { coord: [...coords], eta: new Date(etaMs) };
    });

    setEtaArr(etaArr);

    console.log(etaArr);
  }, [weatherFetchPoints, speed, departureTime, setEtaArr]);

  return <div>You will arrive at your destination at:</div>;
}

export default DistanceCalculator;
