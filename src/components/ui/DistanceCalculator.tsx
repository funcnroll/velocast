import { useEffect, useMemo } from "react";
import { useRoute } from "../../contexts/RouteContext";

function DistanceCalculator({
  departureTime,
  speed,
}: {
  departureTime: Date;
  speed: number;
}) {
  const { distance, weatherFetchPoints, setEtaArr } = useRoute();

  console.log(distance, weatherFetchPoints);

  useEffect(() => {
    if (!weatherFetchPoints.length || !speed) return;

    const etaArr: Date[] = weatherFetchPoints.map((_, i) => {
      const distanceKm = i * 5;
      const hoursToArrive = distanceKm / speed;
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;
      return new Date(etaMs);
    });

    setEtaArr(etaArr);
  }, [weatherFetchPoints, speed, departureTime, setEtaArr]);

  return <div>You will arrive at your destination at:</div>;
}

export default DistanceCalculator;
