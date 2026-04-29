import { useRoute } from "../../contexts/RouteContext";

function DistanceCalculator({
  departureTime,
  speed,
}: {
  departureTime: Date;
  speed: number;
}) {
  const { distance, weatherFetchPoints } = useRoute();

  console.log(distance, weatherFetchPoints);

  const distanceToPointInKmArr = [] as number[];

  weatherFetchPoints.forEach((_, i) => {
    distanceToPointInKmArr.push(i * 5);
    console.log(distanceToPointInKmArr);
  });

  if (distanceToPointInKmArr)
    distanceToPointInKmArr.forEach((distanceToPoint) => {
      const hoursToArrive = distanceToPoint / speed;
      // convert hours to milliseconds and add to departure time
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;
      const eta = new Date(etaMs);
      console.log(eta);
    });

  return <div>You will arrive at your destination at:</div>;
}

export default DistanceCalculator;
