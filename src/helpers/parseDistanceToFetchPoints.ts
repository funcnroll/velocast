import { along } from "@turf/turf";
import type { Feature, LineString } from "geojson";

export function parseDistanceToFetchPoints(
  distance: number,
  line: Feature<LineString>,
) {
  let currentDistanceinKm = 0;
  const gpxDistanceInKm = distance / 1000;
  const weatherFetchPointsArr = [];

  while (currentDistanceinKm < gpxDistanceInKm) {
    const currentPoint = along(line, currentDistanceinKm);
    weatherFetchPointsArr.push(currentPoint);
    currentDistanceinKm += 5;
  }

  return weatherFetchPointsArr;
}
